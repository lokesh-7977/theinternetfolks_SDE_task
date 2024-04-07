import express from "express";
import Auth from "../middlewares/auth.middleware.js";
import { signUp, signIn, profile } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/me",Auth, profile);

export default router;
