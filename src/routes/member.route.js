import express from 'express';

import { addMember , deleteMember } from "../controllers/member.controller.js";

const router = express.Router();



router.post('/', addMember);
router.delete('/:id', deleteMember);

export default router;