const Eleve = require('../models/eleve.model'); // Adjust the path if necessary
const Classe = require('../models/classe.model'); // Import Classe model
const Historique = require('../models/historique.model'); // Adjust the path as needed


// Controller to manage Eleves
const eleveController = {
  // Create a new Eleve
  async createEleve(req, res) {
    try {
      const { nom, prenom, classeId } = req.body.eleve; // Only classId is taken for FK reference

      const existingEleve = await Eleve.findOne({
        where: { nom, prenom, classeId }
      });

      if (existingEleve) {
        // If the Eleve already exists, return a conflict status
        return res.status(409).json({ message: 'Cet élève existe déjà dans cette classe' });
      }

      // Create a new Eleve instance
      const newEleve = await Eleve.create({ nom, prenom, classeId });
      const adminId = req.body.adminId; // Assuming the admin's ID is available in the request (e.g., via authentication)
      const adminRole = req.body.adminRole  // Assuming the admin's role is available in the request

      await Historique.create({
        adminId: adminId, // ID of the admin performing the action
        role: adminRole, // Role of the admin
        typeofaction: ` ${nom}  ${prenom}  قام بترسيم التلميد`, // Arabic for 'add class'
        time: new Date(), // Current time of the action
      });
      return res.status(201).json({ message: 'Élève créé avec succès', eleve: newEleve });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la création de l\'élève', error });
    }
  }
  ,

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
  
      // Get the classeId from the request parameters
      const eleves = await Eleve.findAll({
        where: { classeId }, // Filter by classeId
        include:
        {
          model: Classe,
          as: 'classe'
        }, // Include related Classe data
      });

      if (eleves.length === 0) {
        return res.status(404).json({ message: 'Aucun élève trouvé pour cette classe' });
      }
      const formattedStudents = eleves.map(student => ({
        id: student.id, // Assuming the ID is a number; if it's a string, adjust accordingly
        nom: student.nom,
        prenom: student.prenom,
        classe: {
            id: student.classe.id, // Assuming `classe` is an object with an ID
            nomDeClasse: student.classe.nomDeClasse,
            niveau: student.classe.niveau,
            createdAt: student.classe.createdAt,
            updatedAt: student.classe.updatedAt,
        },
    }));
      return res.status(200).json(formattedStudents);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la récupération des élèves pour la classe', error });
    }
  },



  // Update an Eleve by ID
  async updateEleve(req, res) {
    try {
      const { id } = req.params;
      const { nom, prenom, classeId } = req.body.eleve; // Get classId for FK reference

      const adminId = req.body.adminId; // Assuming the admin's ID is available in the request (e.g., via authentication)
      const adminRole = req.body.adminRole;

      const eleve = await Eleve.findByPk(id);

      if (!eleve) {
        return res.status(404).json({ message: 'Élève non trouvé' });
      }

      eleve.nom = nom;
      eleve.prenom = prenom;
      eleve.classeId = classeId; // Update the foreign key
      await eleve.save();
      await Historique.create({
        adminId: adminId, // ID of the admin performing the action
        role: adminRole, // Role of the admin
        typeofaction: ` ${nom}  ${prenom}  قام بالتغيير في معطيات التلميد`, // Arabic for 'add class'
        time: new Date(), // Current time of the action
      });
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
      const adminId = req.headers.adminid; // Retrieve adminId from headers
      const adminRole = req.headers.adminrole;
      const eleve = await Eleve.findByPk(id);

      if (!eleve) {
        return res.status(404).json({ message: 'Élève non trouvé' });
      }

      await eleve.destroy();
      await Historique.create({
        adminId: adminId, // ID of the admin performing the action
        role: adminRole, // Role of the admin
        typeofaction: ` قام بحدف تلميد من قاعدة البيانات `, // Arabic for 'add class'
        time: new Date(), // Current time of the action
      });
      return res.status(200).json({ message: 'Élève supprimé avec succès' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la suppression de l\'élève', error });
    }
  },
};

module.exports = eleveController;
