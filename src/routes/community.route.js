import express from 'express';
import { createCommunity,
    getAllCommunities,
    createMember,
    getAllMembersByCommunityId,
    getMyOwnedCommunities,
    getMyJoinedCommunities} from '../controllers/community.controller.js';

const router = express.Router();

router.post('/', createCommunity);
router.get('/', getAllCommunities);
router.get('/', createMember);
router.get('/', getAllMembersByCommunityId);
router.get('/', getMyJoinedCommunities);
router.get('/', getMyOwnedCommunities);




export default router;