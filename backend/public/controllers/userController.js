"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAdmins = exports.deleteUser = exports.updateUser = exports.getOneUser = exports.getAllUsers = exports.getAllUsersAndAdmin = exports.refreshAccessToken = exports.logoutUser = exports.profileUser = exports.loginUser = exports.registerUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenBlacklist_1 = require("../utils/tokenBlacklist");
const tokenUtils_1 = require("../utils/tokenUtils");
dotenv_1.default.config();
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "patel";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "hardik";
const registerUser = async (req, res) => {
    let { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        res.status(400).send("All Fields Are Required ");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    try {
        const userData = await userModel_1.default.findOne({ email: email });
        if (userData) {
            res.status(409).json("User Already Exists");
        }
        else {
            const user = new userModel_1.default({
                name: name,
                email: email,
                password: hashedPassword,
                role: role
            });
            const newUser = await userModel_1.default.insertOne(user);
            res.status(201).json({
                message: "User Registered Successfully",
                User: {
                    id: newUser._id,
                    name: name,
                    email: email,
                    role: role || "user"
                }
            });
        }
    }
    catch (err) {
        console.log(err);
        res.json("Error in DB");
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    let { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).send("All Fields are Required");
        }
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Invalid email or password." });
            return;
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password.toString());
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid email or password." });
            return;
        }
        const payload = { sub: user._id.toString(), email: user.email, role: user.role };
        const accessToken = (0, tokenUtils_1.signAccessToken)(payload);
        const refreshToken = (0, tokenUtils_1.signRefreshToken)(payload);
        user.refreshToken = refreshToken; // rotate on login
        await user.save();
        (0, tokenUtils_1.setRefreshCookie)(res, refreshToken);
        res.status(200).json({
            message: "Login successfully",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            role: user.role
        });
    }
    catch (err) {
        console.log(err);
        res.json("Error in DB");
    }
};
exports.loginUser = loginUser;
const profileUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(200).json({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                createdAt: req.user.createdAt,
                updatedAt: req.user.updatedAt,
            },
        });
    }
    catch (error) {
        console.error("Profile error :", error);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.profileUser = profileUser;
const logoutUser = async (req, res) => {
    try {
        const incomingRefreshToken = req.headers.authorization;
        const token = incomingRefreshToken?.split(" ")[1] || req.cookies?.refreshToken;
        if (!token) {
            res.status(400).json({ message: "Refresh token missing" });
            return;
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        }
        catch (err) {
            console.error("Error during logout:", err);
            res.status(403).json({ message: "Invalid Refresh Token" });
            return;
        }
        const user = await userModel_1.default.findById(decoded.sub);
        if (user) {
            user.refreshToken = undefined;
            await user.save();
        }
        if (token) {
            (0, tokenBlacklist_1.blacklistToken)(token);
        }
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (err) {
        console.error("Error during logout:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.logoutUser = logoutUser;
const refreshAccessToken = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken;
        if (!incomingRefreshToken) {
            res.status(401).json({ message: "Refresh token missing" });
        }
        let decoded;
        try {
            decoded = (0, tokenUtils_1.decodedUser)(incomingRefreshToken);
        }
        catch (err) {
            console.error("Error refreshing access token:", err);
            res.status(403).json({ message: "Invalid Refresh Token" });
        }
        const user = await userModel_1.default.findById(decoded.sub);
        if (!user || user.refreshToken !== incomingRefreshToken) {
            res.status(403).json({ message: "Refresh token mismatch or user not found" });
            return;
        }
        const payload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
        };
        const newRefreshToken = (0, tokenUtils_1.signRefreshToken)(payload);
        user.refreshToken = newRefreshToken;
        await user.save();
        (0, tokenUtils_1.setRefreshCookie)(res, newRefreshToken);
        const newAccessToken = (0, tokenUtils_1.signAccessToken)(payload);
        res.status(200).json({
            accessToken: newAccessToken,
            message: "Access token refreshed successfully",
        });
    }
    catch (err) {
        console.error("Error refreshing access token:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.refreshAccessToken = refreshAccessToken;
const getAllUsersAndAdmin = async (req, res) => {
    try {
        let users = await userModel_1.default.find({});
        res.status(200).json({ users });
    }
    catch (err) {
        console.log(err);
        res.json("Error in DB");
    }
};
exports.getAllUsersAndAdmin = getAllUsersAndAdmin;
const getAllUsers = async (req, res) => {
    try {
        let users = await userModel_1.default.find({ role: "user" });
        res.status(200).json({ users });
    }
    catch (err) {
        console.log(err);
        res.json("Error in DB");
    }
};
exports.getAllUsers = getAllUsers;
const getOneUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (req.user?.role !== 'admin' && req.user?._id !== userId) {
            res.status(403).json({ message: "Access Denied" });
            return;
        }
        let user = await userModel_1.default.findById(userId).select("-password -refreshToken");
        if (user) {
            res.status(200).json({ user });
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (err) {
        console.log(err);
        res.json("Error in DB");
    }
};
exports.getOneUser = getOneUser;
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;
        if (req.user?._id != userId) {
            res.status(403).json({ message: "Access Denied" });
            return;
        }
        let user = await userModel_1.default.findByIdAndUpdate(userId, updateData, { new: true });
        if (user) {
            res.status(200).json({ user });
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (err) {
        console.log(err);
        res.json("Error in DB");
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await userModel_1.default.findByIdAndDelete(userId);
        if (user) {
            res.status(200).json({ message: "User deleted successfully" });
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (err) {
        console.log(err);
        res.json("Error in DB");
    }
};
exports.deleteUser = deleteUser;
const getAllAdmins = async (req, res) => {
    try {
        let admins = await userModel_1.default.find({ role: "admin" });
        res.status(200).json({ admins });
    }
    catch (err) {
        console.log(err);
        res.json("Error in DB");
    }
};
exports.getAllAdmins = getAllAdmins;
