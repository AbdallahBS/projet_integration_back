const Classe = require('../models/classe.model');
const Eleve = require('../models/eleve.model');
const Enseignant = require('../models/enseignant.model');
const EnseignantClasse = require('../models/enseignantClasse.model');
const Historique = require('../models/historique.model'); // Adjust the path as needed


const classeController = {

  // Create a new class
  async createClasse(req, res) {
    try {
      const { nomDeClasse, niveau, adminId, adminRole } = req.body;
  
      // Check if the class already exists
      const existingClasse = await Classe.findOne({ where: { nomDeClasse, niveau } });
      if (existingClasse) {
        return res.status(409).json({ message: 'Cette classe existe déjà.' }); // Return a bad request error
      }
  
      // Create a new class
      const newClasse = await Classe.create({ nomDeClasse, niveau });
  
      // Log the action in the Historique
      await Historique.create({
        adminId: adminId, // ID of the admin performing the action
        role: adminRole, // Role of the admin
        typeofaction: `${nomDeClasse} إضافة قسم`, // Arabic for 'add class'
        time: new Date(), // Current time of the action
      });
  
      res.status(201).json({ message: 'Class created successfully', classe: newClasse });
    } catch (error) {
      console.error('Error creating class:', error);
      res.status(500).json({ message: 'Error creating class', error: error.message });
    }
  },
  
// Get all classes with the number of students and teachers
async getAllClassesDetails(req, res) {
  try {
    const classes = await Classe.findAll({
      include: [
        {
          model: Eleve,
          as: 'eleves',
          attributes: ['id', 'nom', 'prenom'], // Only include necessary fields
        },
        {
          model: Enseignant,
          as: 'enseignants',
          through: {
            model: EnseignantClasse, // Specify the junction model to retrieve matiere
            attributes: ['matiere'], // Include matiere field from the junction table
          },
          attributes: ['id', 'nom', 'prenom'], // Include only the needed fields from Enseignant
        }
      ]
    });

    // Format the response to include the student count and teacher info
    const formattedClasses = classes.map(classe => {
      return {
        id: classe.id,
        nomDeClasse: classe.nomDeClasse,
        niveau: classe.niveau,
        studentCount: classe.eleves.length,
        students: classe.eleves.map(eleve =>({
          id: eleve.id,
          nom: eleve.nom,
          prenom: eleve.prenom,
        })), 
        enseignants: classe.enseignants.map(enseignant => ({
          id: enseignant.id,
          nom: enseignant.nom,
          prenom: enseignant.prenom,
          matiere: enseignant.EnseignantClasse.matiere, // Get matiere from the junction table
        })),
        createdAt: classe.createdAt,
        updatedAt: classe.updatedAt
      };
    });

    res.status(200).json({ message: 'Classes retrieved successfully', classes: formattedClasses });
  } catch (error) {
    console.error('Error retrieving classes:', error);
    res.status(500).json({ message: 'Error retrieving classes', error: error.message });
  }
},

  // Get all classes
  async getAllClasses(req, res) {
    try {
      const classes = await Classe.findAll();
      res.status(200).json({ message: 'Classes retrieved successfully', classes });
    } catch (error) {
      console.error('Error retrieving classes:', error);
      res.status(500).json({ message: 'Error retrieving classes', error: error.message });
    }
  },


  

  // Get a single class by ID
  async getClasseById(req, res) {
    try {
      const { id } = req.params;
      const classe = await Classe.findByPk(id);
      if (classe) {
        res.status(200).json({ message: 'Class retrieved successfully', classe });
      } else {
        res.status(404).json({ message: 'Class not found' });
      }
    } catch (error) {
      console.error('Error retrieving class:', error);
      res.status(500).json({ message: 'Error retrieving class', error: error.message });
    }
  },



  // Get classes by niveau
async getClassesByNiveau(req, res) {
  try {
    const { niveau } = req.params;
    const classes = await Classe.findAll({ where: { niveau } });
    if (classes.length > 0) {
      res.status(200).json({ message: 'Classes retrieved successfully', classes });
    } else {
      res.status(404).json({ message: 'No classes found for the given niveau' });
    }
  } catch (error) {
    console.error('Error retrieving classes by niveau:', error);
    res.status(500).json({ message: 'Error retrieving classes by niveau', error: error.message });
  }
},


  // Update a class
  async updateClasse(req, res) {

    
    try {
      const { id } = req.params;
      const { nomDeClasse, niveau ,adminId, adminRole} = req.body;
      const [updatedRowsCount, updatedClasses] = await Classe.update(
        { nomDeClasse, niveau },
        { where: { id }, returning: true }
      );
      
      if (updatedRowsCount === 0) {
        return res.status(404).json({ message: 'Class not found' });
      }
      await Historique.create({
        adminId: adminId, // ID of the admin performing the action
        role: adminRole, // Role of the admin
        typeofaction: `${nomDeClasse} تعديل قسم`, // Arabic for 'update class'
        time: new Date(), // Current time of the action
      });
  
      res.status(200).json({ message: 'Class updated successfully', classe: updatedClasses[0] });
    } catch (error) {
      console.error('Error updating class:', error);
      res.status(500).json({ message: 'Error updating class', error: error.message });
    }
  },

  // Delete a class
  async deleteClasse(req, res) {
    try {
      const { id } = req.params;
      const adminId = req.headers.adminid; // Retrieve adminId from headers
      const adminRole = req.headers.adminrole;      const deletedRowsCount = await Classe.destroy({ where: { id } });
      if (deletedRowsCount) {
        await Historique.create({
          adminId: adminId, // ID of the admin performing the action
          role: adminRole, // Role of the admin
          typeofaction: ` حدف قسم من قاعدة البيانات`, // Arabic for 'update class'
          time: new Date(), // Current time of the action
        });
    
        res.status(200).json({ message: 'Class deleted successfully' });
      } else {
        res.status(404).json({ message: 'Class not found' });
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      res.status(500).json({ message: 'Error deleting class', error: error.message });
    }
  },
};

module.exports = classeController;
