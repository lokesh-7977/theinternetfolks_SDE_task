import express from 'express';
import { createCommunity , getAllCommunities , getAllMembers ,getMyOwnedCommunity , getMyJoinedCommunity } from '../controllers/community.controller.js';
import Auth from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post('/',Auth, createCommunity);
router.get('/',Auth, getAllCommunities);
router.get('/',Auth, getAllMembers);
router.get('/',Auth, getMyOwnedCommunity);
router.get('/',Auth, getMyJoinedCommunity);



export default router;