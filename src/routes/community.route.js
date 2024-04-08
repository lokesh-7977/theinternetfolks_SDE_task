import express from 'express';
import Auth from '../middlewares/auth.middleware.js';
import { createCommunity, getAllCommunities, getAllMembers , getMyOwnedCommunity ,getMyJoinedCommunity } from '../controllers/community.controller.js';

const router = express.Router();

router.post('/',Auth, createCommunity);
router.get('/', getAllCommunities);
router.get('/me/owner', Auth, getMyOwnedCommunity);
router.get('/:id/members', Auth, getAllMembers);
router.get('/me/member', Auth, getMyJoinedCommunity);





export default router;