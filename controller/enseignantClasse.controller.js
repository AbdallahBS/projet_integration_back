const Enseignant = require('../models/Enseignant.model');
const Classe = require('../models/classe.model');
const EnseignantClasse = require('../models/enseignantClasse.model');
const sequelize = require('../db/database'); // Assuming you have a config for your Sequelize instance


const enseignantClasseController = {
    async addTeacherClasses(req, res) {
        const t = await sequelize.transaction();

        try {
            const { enseignantId, classes } = req.body;

            const teacher = await Enseignant.findByPk(enseignantId);
            if (!teacher) {
                throw new Error('Teacher not found');
            }

            for (const classe of classes) {
                const classInstance = await Classe.findByPk(classe.classeId);
                if (!classInstance) {
                    throw new Error(`Class with id ${classe.classeId} not found`);
                }

                await EnseignantClasse.create({
                    enseignantId: teacher.id,
                    classeId: classInstance.id,
                    matiere: classe.matiere
                }, { transaction: t });
            }

            await t.commit();
            res.status(201).json({ message: 'Classes added successfully' });
        } catch (error) {
            await t.rollback();
            res.status(500).json({ error: error.message });
        }
    },

    async updateEnseignantWithClasses(req, res) {
        const { enseignantId } = req.params;
        const { enseignantData } = req.body;
        // const { nom, prenom, numerotel, classes } = req.body;

        try {
            // Step 1: Find the Enseignant
            const enseignant = await Enseignant.findByPk(enseignantId);

            if (!enseignant) {
                return res.status(404).json({ message: 'Enseignant not found' });
            }

            // Step 2: Update the Enseignant's basic info
            enseignant.nom = enseignantData.nom;
            enseignant.prenom = enseignantData.prenom;
            enseignant.numerotel = enseignantData.numerotel;
            await enseignant.save();

            // Step 3: Handle the EnseignantClasses relationship
            // First, clear the existing relations
            await EnseignantClasse.destroy({
                where: { enseignantId: enseignantId }
            });

            // Step 4: Create new EnseignantClasses entries
            const enseignantClasses = enseignantData.classes.map(classe => ({
                enseignantId: enseignantId,
                classeId: classe.classeId,
                matiere: classe.matiere
            }));

            await EnseignantClasse.bulkCreate(enseignantClasses);

            return res.status(200).json({
                message: 'Enseignant and classes updated successfully',
                enseignant: enseignant,
                classes: enseignantClasses
            });
        } catch (error) {
            console.error('Error updating Enseignant and classes:', error);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }

};

module.exports = enseignantClasseController;