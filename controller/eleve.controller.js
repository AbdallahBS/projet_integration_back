const Eleve = require('../models/eleve.model'); // Adjust the path if necessary
const Classe = require('../models/classe.model'); // Import Classe model

// Controller to manage Eleves
const eleveController = {
  // Create a new Eleve
  async createEleve(req, res) {

    try {
      const { nom, prenom, classeId } = req.body; // Only classId is taken for FK reference

      // Create a new Eleve instance
      const newEleve = await Eleve.create({ nom, prenom, classeId });
      const adminId = req.adminId; // Assuming the admin's ID is available in the request (e.g., via authentication)
      const role = req.adminRole  // Assuming the admin's role is available in the request
      console.log(role,adminId,nom);
      
      await Historique.create({
        adminId: adminId,               // ID of the admin performing the action
        role: role,                     // Role of the admin
        typeofaction: 'إضافة تلميذ',   // Arabic for 'add student'
        time: new Date()                // Current time of the action
      });
      return res.status(201).json({ message: 'Élève créé avec succès', eleve: newEleve });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la création de l\'élève', error });
    }


  },

  // Get all Eleves
  async getAllEleves(req, res) {
    try {
      const eleves = await Eleve.findAll({
        include: [{ model: Classe, as: 'classe' }], // Include the related Classe data
      });
      return res.status(200).json(eleves);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la récupération des élèves', error });
    }
  },

  // Get an Eleve by ID
  async getEleveById(req, res) {
    try {
      const { id } = req.params;
      const eleve = await Eleve.findByPk(id, {
        include: [{ model: Classe, as: 'classe' }], // Include related Classe data
      });

      if (!eleve) {
        return res.status(404).json({ message: 'Élève non trouvé' });
      }

      return res.status(200).json(eleve);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la récupération de l\'élève', error });
    }
  },


  async getElevesByClasseId(req, res) {
    try {
      const { classeId } = req.params;
      console.log(Eleve.associations);
console.log(Classe.associations);
      console.log(classeId);
       // Get the classeId from the request parameters
      const eleves = await Eleve.findAll({
        where: { classeId }, // Filter by classeId
        include: 
          { 
           model: Classe,
           as: 'classe' }, // Include related Classe data
      });

      if (eleves.length === 0) {
        return res.status(404).json({ message: 'Aucun élève trouvé pour cette classe' });
      }

      return res.status(200).json(eleves);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la récupération des élèves pour la classe', error });
    }
  },



  // Update an Eleve by ID
  async updateEleve(req, res) {
    try {
      const { id } = req.params;
      const { nom, prenom, classeId } = req.body; // Get classId for FK reference

      const eleve = await Eleve.findByPk(id);

      if (!eleve) {
        return res.status(404).json({ message: 'Élève non trouvé' });
      }

      eleve.nom = nom;
      eleve.prenom = prenom;
      eleve.classeId = classeId; // Update the foreign key
      await eleve.save();

      return res.status(200).json({ message: 'Élève mis à jour avec succès', eleve });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'élève', error });
    }
  },

  // Delete an Eleve by ID
  async deleteEleve(req, res) {
    try {
      const { id } = req.params;

      const eleve = await Eleve.findByPk(id);

      if (!eleve) {
        return res.status(404).json({ message: 'Élève non trouvé' });
      }

      await eleve.destroy();
      return res.status(200).json({ message: 'Élève supprimé avec succès' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la suppression de l\'élève', error });
    }
  },
};

module.exports = eleveController;
