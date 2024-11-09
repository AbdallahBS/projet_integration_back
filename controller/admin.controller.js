const bcrypt = require('bcrypt');
const Admin = require('../models/admin.model');
const { Op } = require('sequelize');

// Create a new Admin (with bcrypt password hashing)
const createAdmin = async (req, res) => {
    const { username, mdp, role } = req.body;

    try {
        // Check if the username already exists
        const userExistsInAdmin = await Admin.findOne({ where: { username } });
        
        if (userExistsInAdmin) {
            return res.status(400).json({ error: 'Admin already exists' });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(mdp, 10);

        // Create a new Admin
        const newUser = await Admin.create({
            username,
            mdp: hashedPassword,
            role
        });

        res.status(201).json({
            message: 'Admin created successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                role: newUser.role
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAdmins = async (req, res) => {
    try {
        const { excludeId } = req.query; // Get the admin ID from the query parameters
        const admins = await Admin.findAll({
            where: {
                id: {
                    [Op.ne]: excludeId // Exclude the admin with the provided ID
                }
            }
        });
        res.status(200).json(admins);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get Admin by ID
const getAdminById = async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await Admin.findByPk(id);

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.status(200).json(admin);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update Admin (with bcrypt password hashing if password is updated)
const updateAdmin = async (req, res) => {
    const { id } = req.params;
    const { username, mdp, role } = req.body;

    try {
        const admin = await Admin.findByPk(id);

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        // Update fields if they are provided
        if (username) admin.username = username;
        if (role) admin.role = role;

        // Hash the new password if it is provided
        if (mdp) {
            const hashedPassword = await bcrypt.hash(mdp, 10);
            admin.mdp = hashedPassword;
        }

        await admin.save();

        res.status(200).json({
            message: 'Admin updated successfully',
            user: {
                id: admin.id,
                username: admin.username,
                role: admin.role
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete Admin
const deleteAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await Admin.findByPk(id);

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        await admin.destroy();

        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createAdmin,
    getAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin
};
