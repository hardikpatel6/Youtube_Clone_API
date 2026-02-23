import express from "express";
import {googleLogin,registerUser,loginUser,profileUser,logoutUser,getAllUsersAndAdmin,getAllUsers,getOneUser,updateUser,deleteUser,getAllAdmins,refreshAccessToken} from "../controllers/userController";
import {auth,isAdmin} from "../middlewares/authMiddleware";
const router = express.Router();

router.post("/google", googleLogin);
router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/refreshToken",refreshAccessToken);
router.post("/logout",auth,logoutUser);
router.get("/profile",auth,profileUser);
router.get("/getAllData",auth,isAdmin,getAllUsersAndAdmin);
router.get("/getAllUsers",auth,isAdmin,getAllUsers);
router.get("/getAllAdmins",auth,isAdmin,getAllAdmins);
router.get("/:id",auth,getOneUser);
router.put("/:id",auth,updateUser);
router.delete("/:id",auth,deleteUser);

export default router;