import express from "express";
import { signup, login, checkAuth, logout , getAllUser } from "../controllers/user.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", authUser, checkAuth);
router.post("/logout", logout);
router.get('/all',authUser,getAllUser)

export default router;
