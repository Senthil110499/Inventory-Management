import express from "express";
import { login, resetPassword, signUp } from "../controllers/User.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/resetpassword", resetPassword);

export default router;
