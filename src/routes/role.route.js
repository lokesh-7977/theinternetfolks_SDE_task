import express from "express";

import { createRole , getAllRoles } from "../controllers/role.controller.js";

const router = express.Router();

router.post("/", createRole);
router.get("/", getAllRoles);

export default router;
