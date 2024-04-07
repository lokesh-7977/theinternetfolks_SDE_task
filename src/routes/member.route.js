import express from 'express';

import { addMember , deleteMember } from "../controllers/member.controller.js";
import  Auth  from "../middlewares/auth.middleware.js";
const router = express.Router();



router.post('/',Auth, addMember);
router.delete('/:id',Auth, deleteMember);

export default router;