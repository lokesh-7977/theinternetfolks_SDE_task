import Member from "../models/role.model.js";
import Role from "../models/role.model.js";

const isRole = async (communityId, userId, roleId) => {
  const isRole = await Member.findOne({
    community: communityId,
    user: userId,
    role: roleId,
  });
  return isRole;
};

export const addMember = async (req, res) => {
  try {
    const { community, user, role } = req.body;

    const adminRole = await Role.findOne({  name: "Community Admin" });

    if ((!await isRole(community, req.user.toObject()._id, adminRole))) {
      return res.status(403).json({ message: "Not allowed access" });
    }

    const memberRole = await Role.findOne({ name: "Community Member" });

    const newMember = await Member.create({
      community,
      user,
      role: role,
    });

    res.status(201).json({
      status: true,
      content: {
        data: {
          newMember,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
      err : err.message
    });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const moderatorRole = await Role.findOne({ name: "Community Moderator" });
    const adminRole = await Role.findOne({ name: "Community Admin" });

    if (
      !(await isRole(req.params.cid, req.user.toObject()._id, adminRole)) &&
      !(await isRole(req.params.cid, req.user.toObject()._id, moderatorRole))
    ) {
      return res.status(403).json({ message: "Not allowed access" });
    }

    const member = await Member.findByIdAndDelete(req.params.id).populate(
      "community"
    );

    return res.json({ status: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
