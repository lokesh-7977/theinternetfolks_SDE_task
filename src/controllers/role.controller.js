import Role from '../models/role.model.js';

export const createRole = async (req, res) => {
    const { name } = req.body;
    if(name.length < 2 ){
        return res.status(400).json({ status: false, message: "Role name must be at least 2 characters" });
    }

    if (!name) {
        return res.status(400).json({ status: false, message: "Role name is required" });
    }

    try {
        const role = new Role({
            name
        });

        await role.save();

        res.status(201).json({
            status: true,
            content: {
              data: {
                id: role._id,
                name: role.name,
                created_at: role.createdAt,
                updated_at: role.updatedAt
              }
            }
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }

}


export const getAllRoles = async (req, res) => {
    try {
      const page = parseInt(req.query.page)  || 1;
      const limit = parseInt(req.query.limit) || 10;
  
      const totalRoles = await Role.countDocuments();
  
      const totalPages = Math.ceil(totalRoles / limit);
  
      const currentPage = Math.min(Math.max(page, 1), totalPages);
  
      const offset = (currentPage - 1) * limit;
  
      const roles = await Role.find()
        .skip(offset)
        .limit(limit);
  
      res.status(200).json({
        status: true,
        content: {
          meta: {
            total: totalRoles,
            pages: totalPages,
            page: currentPage,
          },
          data: roles,
        },
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };