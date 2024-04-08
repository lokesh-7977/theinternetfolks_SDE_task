import Member from "../models/member.model.js";
import Role from "../models/role.model.js";

const hasRole = async (communityId, userId, roleId) => {
  return await Member.exists({ community: communityId, user: userId, role: roleId });
};

export const addMember = async (req, res) => {
  try {
    const { community, user, role } = req.body;

    if (!community || !user || !role) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const isAdminOrModerator = await hasRole(community, req.user.id, { $in: ["Community Admin", "Community Moderator"] });
    if (!isAdminOrModerator) {
      return res.status(403).json({ message: "Not allowed access" });
    }

    const newMember = await Member.create({ community, user, role });

    res.status(201).json({
      status: true,
      content: {
        data: {
          id: newMember._id,
          community: newMember.community,
          user: newMember.user,
          role: newMember.role,
          createdAt: newMember.createdAt,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const moderatorRole = await Role.findOne({ name: "Community Moderator" });
    const adminRole = await Role.findOne({ name: "Community Admin" });

    if (!moderatorRole || !adminRole) {
      return res.status(500).json({ message: "Server Error: Moderator or Admin role not found" });
    }

    if (
      !(await hasRole(req.params.id, req.user.id, adminRole._id)) &&
      !(await hasRole(req.params.id, req.user.id, moderatorRole._id))
    ) {
      return res.status(403).json({ message: "Not allowed access" });
    }

    const member = await Member.findById(req.params.id).populate("community");
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    await member.remove();
    return res.json({ message: "Member removed successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

