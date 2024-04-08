import jwt from 'jsonwebtoken';
import Community from '../models/community.model.js';
import Role from '../models/role.model.js';
import config from '../config/index.js';
import Member from '../models/member.model.js';

export const createCommunity = async (req, res) => {
    try {
        const { name } = req.body;

        const token = req.headers.authorization?.split(' ')[1];

        const { id: ownerId } = jwt.verify(token, config.JWT_SECRET);

        const slug = name.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-');
        const community = await Community.create({
            name,
            slug,
            owner: ownerId,
        });

        const adminRole = await Role.findOne({ name: 'Community Admin' });
    
        res.status(201).json({
            status: true,
            content : {
                data: { 
                    id: community._id,
                    name: community.name,
                    slug: community.slug,
                    owner: community.owner,
                    createdat: community.createdAt,
                    updatedat: community.updatedAt
                },
            }
           
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' ,err:err.message});
    }
};


export const getAllCommunities = async (req, res) => {
    try {
        const communities = await Community.find();
        res.status(200).json({ status: true, content: communities });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}


export const getAllMembers = async (req, res) => {
    try {
        const communityId = req.params.id; // Assuming you get the community ID from the request parameters

        // Query the database to get all members of the community
        const members = await Member.find({ community: communityId });

        // Prepare the response data
        const responseData = {
            status: true,
            content: {
                meta: {
                    total: members.length,
                    pages: 1, // Assuming no pagination for now
                    page: 1, // Assuming no pagination for now
                },
                data: [],
            },
        };

        // Loop through each member and populate user and role details
        for (const member of members) {
            const user = await User.findById(member.user, { id: 1, name: 1 }); // Assuming user model has 'id' and 'name' fields
            const role = await Role.findById(member.role, { id: 1, name: 1 }); // Assuming role model has 'id' and 'name' fields

            // Construct member object to include user and role details
            const memberData = {
                id: member.id,
                community: member.community,
                user: {
                    id: user.id,
                    name: user.name,
                },
                role: {
                    id: role.id,
                    name: role.name,
                },
                created_at: member.created_at,
            };

            // Add member object to response data
            responseData.content.data.push(memberData);
        }

        // Send the response
        res.status(200).json(responseData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};



export const getMyOwnedCommunity = async (req, res) => {
    try {
        // Get the currently signed-in user's ID from the request object
        const ownerId = req.user.id;

        // Query the database to find communities owned by the current user
        const ownedCommunities = await Community.find({ owner: ownerId });

        // Send success response with the list of owned communities
        res.status(200).json({
            status: true,
            content: {
                data: ownedCommunities,
            }
        });
    } catch (err) {
        // Handle any errors and send an appropriate error response
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


export const getMyJoinedCommunity = async (req, res) => {
    try {
        // Get the currently signed-in user's ID from the request object
        const userId = req.user.id;

        // Query the database to find communities the current user has joined
        const joinedCommunities = await Member.find({ user: userId });

        // Prepare an array to store community IDs
        const communityIds = joinedCommunities.map(member => member.community);

        // Query the database to find community details based on the IDs
        const communities = await Community.find({ _id: { $in: communityIds } });

        // Send success response with the list of joined communities
        res.status(200).json({
            status: true,
            content: {
                data: communities,
            }
        });
    } catch (err) {
        // Handle any errors and send an appropriate error response
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


