import express from 'express';
import { createCommunity , getAllCommunities , getAllMembers ,getMyOwnedCommunity , getMyJoinedCommunity } from '../controllers/community.controller.js';

const router = express.Router();

router.post('/', createCommunity);
router.get('/', getAllCommunities);
router.get('/', getAllMembers);
router.get('/', getMyOwnedCommunity);
router.get('/', getMyJoinedCommunity);



export default router;