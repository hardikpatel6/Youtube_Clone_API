import type { Request, Response } from "express";
import type { IUserDocument } from "../models/userModel";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import validator from "validator";
import { blacklistToken } from "../utils/tokenBlacklist";
import { decodedUser, setRefreshCookie, signAccessToken, signRefreshToken } from "../utils/tokenUtils";
import { AuthRequest } from "../middlewares/authMiddleware";
dotenv.config();
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "patel";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "hardik";

import { verifyGoogleToken } from "../utils/googleAuth";

const googleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            res.status(400).json({ message: "Google token missing" });
            return;
        }

        // 1️⃣ Verify Google Token
        const payload = await verifyGoogleToken(idToken);

        if (!payload) {
            res.status(401).json({ message: "Invalid Google token" });
            return;
        }

        const { sub, email, name } = payload;

        if (!email) {
            res.status(400).json({ message: "Google account has no email" });
            return;
        }

        // 2️⃣ Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // 3️⃣ Create new Google user
            user = await User.create({
                name,
                email,
                googleId: sub,
                isGoogleUser: true,
                role: "user"
            });
        }

        // 4️⃣ Generate tokens (reuse your existing logic)
        const payloadJwt = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role
        };

        const accessToken = signAccessToken(payloadJwt);
        const refreshToken = signRefreshToken(payloadJwt);

        user.refreshToken = refreshToken;
        await user.save();

        setRefreshCookie(res, refreshToken);

        res.status(200).json({
            message: "Google login successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            role: user.role
        });

    } catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ message: "Google login failed" });
    }
};

const registerUser = async (req: Request, res: Response): Promise<void> => {
    let { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        res.status(400).send("All Fields Are Required ");
    }
    
    // 2️⃣ Normalize email
    email = email.toLowerCase().trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.(com|in|gov)$/;
    // 3️⃣ Validate email format (strong validation)
     if (!emailRegex.test(email)) {
      res.status(400).json({
        message: "Email must contain @ and end with .com, .in, or .gov",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const userData: IUserDocument | null = await User.findOne({ email: email });
        if (userData) {
            res.status(409).json("User Already Exists");
        } else {
            const user: IUserDocument = new User({
                name: name,
                email: email,
                password: hashedPassword,
                role: role
            });
            const newUser = await User.insertOne(user);
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
    } catch (err: unknown) {
        console.log(err);
        res.json("Error in DB");
    }
}

const loginUser = async (req: Request, res: Response): Promise<void> => {
    let { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).send("All Fields are Required");
        }
        const user: IUserDocument | null = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Invalid email or password." });
            return;
        }
        if (user.isGoogleUser) {
            res.status(400).json({ message: "Use Google Sign-In for this account" });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password?.toString() || "");
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid email or password." });
            return;
        }

        const payload = { sub: user._id.toString(), email: user.email, role: user.role }
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        user.refreshToken = refreshToken; // rotate on login
        await user.save();
        setRefreshCookie(res, refreshToken);
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
        })
    } catch (err: unknown) {
        console.log(err);
        res.json("Error in DB");
    }
}

const profileUser = async (req: AuthRequest, res: Response): Promise<Response | void> => {
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
    } catch (error) {
        console.error("Profile error :", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const incomingRefreshToken: string | undefined = req.headers.authorization;
        const token: string | undefined = incomingRefreshToken?.split(" ")[1] || req.cookies?.refreshToken;
        if (!token) {
            res.status(400).json({ message: "Refresh token missing" });
            return;
        }
        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string)
        } catch (err) {
            console.error("Error during logout:", err);
            res.status(403).json({ message: "Invalid Refresh Token" });
            return;
        }
        const user = await User.findById(decoded.sub);
        if (user) {
            user.refreshToken = undefined;
            await user.save();
        }
        if (token) {
            blacklistToken(token);
        }
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Error during logout:", err);
        res.status(500).json({ message: "Server error" });
    }
}

const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken;
        if (!incomingRefreshToken) {
            res.status(401).json({ message: "Refresh token missing" });
        }

        let decoded: any;
        try {
            decoded = decodedUser(incomingRefreshToken);
        } catch (err) {
            console.error("Error refreshing access token:", err);
            res.status(403).json({ message: "Invalid Refresh Token" });
        }

        const user = await User.findById(decoded.sub);
        if (!user || user.refreshToken !== incomingRefreshToken) {
            res.status(403).json({ message: "Refresh token mismatch or user not found" });
            return;
        }
        const payload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
        }
        const newRefreshToken = signRefreshToken(payload);
        user.refreshToken = newRefreshToken;
        await user.save();

        setRefreshCookie(res, newRefreshToken);

        const newAccessToken = signAccessToken(payload);

        res.status(200).json({
            accessToken: newAccessToken,
            message: "Access token refreshed successfully",
        });
    } catch (err) {
        console.error("Error refreshing access token:", err);
        res.status(500).json({ message: "Server error" });
    }
}

const getAllUsersAndAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        let users: IUserDocument[] | null = await User.find({});
        res.status(200).json({ users });
    } catch (err: unknown) {
        console.log(err);
        res.json("Error in DB");
    }
}

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        let users: IUserDocument[] | null = await User.find({ role: "user" });
        res.status(200).json({ users });
    } catch (err: unknown) {
        console.log(err);
        res.json("Error in DB");
    }
}

const getOneUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;

        if (req.user?.role !== 'admin' && req.user?._id !== userId) {
            res.status(403).json({ message: "Access Denied" });
            return;
        }

        let user: IUserDocument | null = await User.findById(userId).select(
            "-password -refreshToken"
        );

        if (user) {
            res.status(200).json({ user });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err: unknown) {
        console.log(err);
        res.json("Error in DB");
    }
}

const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const updateData = req.body;

        if (req.user?._id != userId) {
            res.status(403).json({ message: "Access Denied" });
            return;
        }

        let user: IUserDocument | null = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (user) {
            res.status(200).json({ user });
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err: unknown) {
        console.log(err);
        res.json("Error in DB");
    }
}

const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        let user: IUserDocument | null = await User.findByIdAndDelete(userId);
        if (user) {
            res.status(200).json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err: unknown) {
        console.log(err);
        res.json("Error in DB");
    }
}

const getAllAdmins = async (req: Request, res: Response): Promise<void> => {
    try {
        let admins: IUserDocument[] | null = await User.find({ role: "admin" });
        res.status(200).json({ admins });
    } catch (err: unknown) {
        console.log(err);
        res.json("Error in DB");
    }
}

export { googleLogin, registerUser, loginUser, profileUser, logoutUser, refreshAccessToken, getAllUsersAndAdmin, getAllUsers, getOneUser, updateUser, deleteUser, getAllAdmins };