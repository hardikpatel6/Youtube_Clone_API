"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false
    },
    googleId: {
        type: String
    },
    isGoogleUser: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    refreshToken: {
        type: String
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, { timestamps: true });
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
