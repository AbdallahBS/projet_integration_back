const Eleve = require('../models/eleve.model'); // Adjust the path if necessary

// Controller to manage Eleves
const eleveController = {
  // Create a new Eleve
  async createEleve(req, res) {
    try {
      const { nom, prenom, classe, niveau } = req.body;

      // Create a new Eleve instance
      const newEleve = await Eleve.create({ nom, prenom, classe, niveau });

      return res.status(201).json({ message: 'Élève créé avec succès', eleve: newEleve });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la création de l\'élève', error });
    }
  },

  // Get all Eleves
  async getAllEleves(req, res) {
    try {
      const eleves = await Eleve.findAll();
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
      const eleve = await Eleve.findByPk(id);

      if (!eleve) {
        return res.status(404).json({ message: 'Élève non trouvé' });
      }

      return res.status(200).json(eleve);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la récupération de l\'élève', error });
    }
  },

  // Update an Eleve by ID
  async updateEleve(req, res) {
    try {
      const { id } = req.params;
      const { nom, prenom, classe, niveau } = req.body;

      const eleve = await Eleve.findByPk(id);

      if (!eleve) {
        return res.status(404).json({ message: 'Élève non trouvé' });
      }

      eleve.nom = nom;
      eleve.prenom = prenom;
      eleve.classe = classe;
      eleve.niveau = niveau;
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
