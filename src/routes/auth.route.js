import express from "express";
import { signUp, signIn ,profile} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/me", profile);
export default router;