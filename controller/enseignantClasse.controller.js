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
    }
};

module.exports = enseignantClasseController;