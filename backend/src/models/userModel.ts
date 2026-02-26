import { Schema, model, HydratedDocument } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password?: string;
    role: string;
    refreshToken?: string;
    googleId?: string;     // 👈 add
    isGoogleUser?: boolean; // 👈 add
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
}
export type IUserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>({
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

const User = model<IUser>('User', userSchema);

export default User;