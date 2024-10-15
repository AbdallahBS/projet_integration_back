const Eleve = require('../models/eleve.model');
const Enseignant = require('../models/enseignant.model');
const Classe = require('../models/classe.model');
const Admin = require('../models/admin.model');
const Historique = require('../models/historique.model'); // Import Historique model

const dahboardController = {
 async getDashboardCounts (req, res)  {
  try {
    // Count the total number of students (eleves)
    const elevesCount = await Eleve.count();

    // Count the total number of teachers (enseignants)
    const enseignantsCount = await Enseignant.count();

    // Count the total number of classes
    const classesCount = await Classe.count();

    // Count the total number of admins (superadmin and admin)
    const adminsCount = await Admin.count();

    // Return all counts in a single response
    res.status(200).json({
      elevesCount,
      enseignantsCount,
      classesCount,
      adminsCount,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "An error occurred while fetching dashboard data." });
  }
},


 // New function to get historique records
 async getHistorique(req, res) {
    try {
      // Fetch all historique records
      const historiques = await Historique.findAll({
        // Optionally, you can add sorting, filtering, or pagination here
        order: [['time', 'DESC']],
        include: [
            {
              model: Admin,
              as: 'admin', // Use the alias defined in your association
              attributes: ['id', 'username', 'role'], // Specify the fields you want to include from the Admin model
            },
          ], // Example: sort by time in descending order
      });

      res.status(200).json(historiques);
    } catch (error) {
      console.error("Error fetching historique data:", error);
      res.status(500).json({ message: "An error occurred while fetching historique data." });
    }
  }
}

module.exports = dahboardController;