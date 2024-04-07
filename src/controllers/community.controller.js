import jwt from 'jsonwebtoken';
import { Snowflake } from '@theinternetfolks/snowflake';
import communityModel from '../models/community.model.js';
import userModel from '../models/user.model.js';
import memberModel from '../models/member.model.js';
import config from '../config/index.js';

const createCommunity = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const bearer_token = authHeader && authHeader.split(' ')[1];
        const name = req.body.name;

        jwt.verify(bearer_token, config.JWT_SECRET, async (err, tokenData) => {
            if (err) {
                res.send('You have not access.');
            } else {
                if (name.length < 2) {
                    res.send('Name should contain minimum 2 characters.');
                } else {
                    const id = Snowflake.generate(); // Generate Snowflake ID
                    const slug = name.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-') + Snowflake.generate();
                    const new_community = new communityModel({
                        "id": id,
                        "name": name,
                        "slug": slug,
                        "owner": tokenData,
                        "created_at": new Date(),
                        "updated_at": new Date(),
                    });
                    new_community.save().then(result => {
                        const response = {
                            "status": true,
                            "content": {
                                "data": {
                                    "id": result["id"],
                                    "name": result["name"],
                                    "slug": result["slug"],
                                    "owner": result["owner"],
                                    "created_at": result["created_at"],
                                    "updated_at": result["updated_at"]
                                }
                            }
                        }
                        res.send(response);
                    }).catch(err => {
                        console.log(err);
                        res.send("Something went wrong.")
                    });
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


const getAllCommunities = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const data = await communityModel.find().skip(skip).limit(limit);
        let response = [];
        for (let i = 0; i < data.length; i++) {
            const owner = await userModel.findOne({ "id": data[i].owner });
            const x = {
                "id": data[i].id,
                "name": data[i].name,
                "slug": data[i].slug,
                "owner": {
                    "id": data[i].owner,
                    "name": owner['name']
                },
                "created_at": data[i].created_at,
                "updated_at": data[i].updated_at
            }
            response.push(x);
        }
        const total = await communityModel.countDocuments();
        const pages = Math.ceil(total / limit);
        response = {
            "status": true,
            "content": {
                "meta": {
                    "total": total,
                    "pages": pages,
                    "page": page
                },
                "data": response
            }
        }
        res.send(response);
    } catch (err) {
        console.error(err);
        res.send("Somethings went wrong.");
    }
};

const createMember = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const bearer_token = authHeader && authHeader.split(' ')[1];
        const community = req.body.community;
        const user = req.body.user;
        const role = req.body.role;

        jwt.verify(bearer_token, secretKey, async (err, tokenData) => {
            if (err) {
                res.send("You have not access.");
            } else {
                const new_member = new memberModel({
                    'id': uuid.v4(),
                    'community': community,
                    'user': user,
                    'role': role,
                    'created_at': new Date()
                });
                try {
                    const community_data = await communityModel.findOne({ "owner": tokenData });
                    if (community_data) {
                        new_member.save().then(result => {
                            const response = {
                                "status": true,
                                "content": {
                                    "data": {
                                        "id": result.id,
                                        "community": result.community,
                                        "user": result.user,
                                        "role": result.role,
                                        "created_at": result.created_at
                                    }
                                }
                            }
                            res.send(response);
                        }).catch(err => {
                            console.log(err);
                            res.send("Something went wrong.")
                        });
                    } else {
                        res.send("NOT_ALLOWED_ACCESS")
                    }
                } catch (err) {
                    console.log(err);
                    res.send("Somthing wents wrong.")
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAllMembersByCommunityId = async (req, res) => {
    try {
        const communityId = req.params.id;
        let data = [];
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const members = await memberModel.find({ "community": communityId }).skip(skip).limit(limit);
        for (let i = 0; i < members.length; i++) {
            const user = await userModel.findOne({ "id": members[i].user });
            const user_name = user.name;
            const role = await roleModel.findOne({ "id": members[i].role });
            const role_name = role.name;
            const x = {
                "id": members[i].id,
                "community": members[i].community,
                "user": {
                    "id": members[i].user,
                    "name": user_name
                },
                "role": {
                    "id": members[i].role,
                    "name": role_name
                },
                "created_at": members[i].created_at
            }
            data.push(x);
        }
        const total = await memberModel.countDocuments();
        const pages = Math.ceil(total / limit);
        data = {
            "status": true,
            "content": {
                "meta": {
                    "total": total,
                    "pages": pages,
                    "page": page
                },
                "data": data
            }
        }
        res.send(data);
    } catch (err) {
        console.error(err);
        res.send("Somethings went wrong.");
    }
};

const getMyOwnedCommunities = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const bearer_token = authHeader && authHeader.split(' ')[1];
        jwt.verify(bearer_token, secretKey, async (err, tokenData) => {
            if (err) {
                res.send("You have not access.");
            } else {
                try {
                    const page = parseInt(req.query.page) || 1;
                    const limit = parseInt(req.query.limit) || 10;
                    const skip = (page - 1) * limit;
                    const myOwnedCommunity = await communityModel.find({ "owner": tokenData }).skip(skip).limit(limit);
                    let data = [];
                    for (let i = 0; i < myOwnedCommunity.length; i++) {
                        const x = {
                            "id": myOwnedCommunity[i].id,
                            "name": myOwnedCommunity[i].name,
                            "slug": myOwnedCommunity[i].slug,
                            "owner": myOwnedCommunity[i].owner,
                            "created_at": myOwnedCommunity[i].created_at,
                            "updated_at": myOwnedCommunity[i].updated_at
                        }
                        data.push(x);
                    }
                    const total = await communityModel.countDocuments();
                    const pages = Math.ceil(total / limit);
                    const response = {
                        "status": true,
                        "content": {
                            "meta": {
                                "total": total,
                                "pages": pages,
                                "page": page
                            },
                            "data": data
                        }
                    }
                    res.send(response);
                } catch (err) {
                    console.error(err);
                    res.send("Something went wrong.");
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getMyJoinedCommunities = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const bearer_token = authHeader && authHeader.split(' ')[1];
        jwt.verify(bearer_token, secretKey, async (err, tokenData) => {
            if (err) {
                res.send("You have not access.");
            } else {
                try {
                    const page = parseInt(req.query.page) || 1;
                    const limit = parseInt(req.query.limit) || 10;
                    const skip = (page - 1) * limit;
                    const myMembership = await memberModel.find({ "user": tokenData }).skip(skip).limit(limit);
                    let data = [];
                    for (let i = 0; i < myMembership.length; i++) {
                        const community_data = await communityModel.findOne({ "id": myMembership[i].community });
                        let owner_name = await userModel.findOne({ "id": community_data.owner });
                        owner_name = owner_name.name;
                        const x = {
                            "id": community_data.id,
                            "name": community_data.name,
                            "slug": community_data.slug,
                            "owner": {
                                "id": community_data.owner,
                                "name": owner_name,
                            },
                            "created_at": community_data.created_at,
                            "updated_at": community_data.updated_at
                        }
                        data.push(x);
                    }
                    const total = await memberModel.countDocuments();
                    const pages = Math.ceil(total / limit);
                    const response = {
                        "status": true,
                        "content": {
                            "meta": {
                                "total": total,
                                "pages": pages,
                                "page": page
                            },
                            "data": data
                        }
                    }
                    res.send(response);
                } catch (err) {
                    console.error(err);
                    res.send("Something went wrong.");
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export   {
    createCommunity,
    getAllCommunities,
    createMember,
    getAllMembersByCommunityId,
    getMyOwnedCommunities,
    getMyJoinedCommunities
};
