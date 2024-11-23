const Etude = require('../models/etude.model');
const Seance = require('../models/seance.model');
const Eleve = require('../models/eleve.model');
const Attendance = require('../models/attendance.model');
const Enseignant = require('../models/enseignant.model');
const moment = require('moment');

// Create an Etude with associated Seances
exports.createEtudeWithSeances = async (req, res) => {
  try {
    // Extract fields from the request body
    const { niveau, startTime, endTime, enseignantId, matiere, seanceDates } = req.body;
 console.log(niveau, startTime, endTime, enseignantId, matiere, seanceDates);
 
    // Create the Etude
    const etude = await Etude.create({
      niveau,
      startTime,
      endTime,
      enseignantId,
      matiere,
    });

    // Convert the seanceDates to valid ISO date format
    const formattedDates = seanceDates.map(date => moment(date, 'DD/MM').format('YYYY-MM-DD'));

    // Create Seance records and associate them with the Etude
    const seances = await Promise.all(
      formattedDates.map((date) =>
        Seance.create({ date, etudeId: etude.id })
      )
    );

    // Send the response with created Etude and Seances
    res.status(201).json({ etude, seances });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create Etude with Seances' });
  }
};
// Add students to a specific Etude
exports.addElevesToEtude = async (req, res) => {
    try {
      const { etudeId, eleveIds } = req.body; // Extract Etude ID and list of Eleve IDs from the request body
  
      // Check if the Etude exists
      const etude = await Etude.findByPk(etudeId);
      if (!etude) {
        return res.status(404).json({ error: 'Etude not found' });
      }
  
      // Check if Eleve IDs are valid and exist
      const eleves = await Eleve.findAll({
        where: {
          id: eleveIds, // Find Eleves that match the provided IDs
        },
      });
  
      // If no Eleves found
      if (eleves.length === 0) {
        return res.status(404).json({ error: 'No students found for the provided IDs' });
      }
  
      // Add Eleves to the Etude via the junction table (EleveEtudes)
      await etude.addEleves(eleves); // Sequelize handles the bulk insert in the junction table
  
      res.status(200).json({
        message: 'Students added to the Etude successfully',
        etudeId,
        eleveIds,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add students to Etude' });
    }
  };


  exports.getElevesFromEtude = async (req, res) => {
    try {
      const { etudeId } = req.params; // Extract Etude ID from the request params
  
      // Fetch the Etude with associated Eleves, Attendances, and Seances
      const etude = await Etude.findByPk(etudeId, {
        include: [
          {
            model: Eleve,
            as: 'etudeEleves', // Alias for Eleves in the Etude
            through: { attributes: [] }, // Exclude junction table data
            include: [
              {
                model: Attendance,
                as: 'attendances',
               // Filter Attendance records by Etude ID
                // Alias for Attendance
                include: [
                  {
                    model: Seance,
                    as: 'seance',
                    where: { etudeId },  // Include Seance details
                    attributes: ['id', 'date'], // Limit Seance fields
                  },
                ],
                attributes: ['id', 'attendanceStatus'], // Limit Attendance fields
              },
            ],
          },
        ],
      });
  
      // If the Etude is not found
      if (!etude) {
        return res.status(404).json({ error: 'Etude not found' });
      }
  
      // Retrieve associated Eleves along with their Attendance and Seance data
      const eleves = etude.etudeEleves.map((eleve) => {
        // Sort attendances chronologically by Seance date
        const sortedAttendances = eleve.attendances.sort((a, b) => {
          const dateA = new Date(a.seance.date);
          const dateB = new Date(b.seance.date);
          return dateA - dateB; // Sort in ascending order
        });
  
        return {
          id: eleve.id,
          nom: eleve.nom,
          prenom: eleve.prenom,
          attendances: sortedAttendances.map((attendance) => ({
            attendanceId: attendance.id,
            status: attendance.attendanceStatus,
            seance: {
              id: attendance.seance?.id,
              date: attendance.seance?.date,
            },
          })),
        };
      });
  
      res.status(200).json({
        etudeId,
        eleves, // List of students with their attendance and seance data
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve students and attendance data from Etude' });
    }
  };
  


  exports.removeEleveFromEtude = async (req, res) => {
    try {
      const { etudeId, eleveId } = req.params;
  
      // Find the Etude instance
      const etude = await Etude.findByPk(etudeId);
      if (!etude) {
        return res.status(404).json({ error: 'Etude not found' });
      }
  
      // Find the Eleve instance
      const eleve = await Eleve.findByPk(eleveId);
      if (!eleve) {
        return res.status(404).json({ error: 'Eleve not found' });
      }
  
      // Use the correct method to remove the association
      await etude.removeEtudeEleves(eleve);
  
      res.status(200).json({
        message: `Eleve with ID ${eleveId} successfully removed from Etude with ID ${etudeId}`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to remove Eleve from Etude' });
    }
  };
  
  


// Get all Etudes with associated Seances
exports.getAllEtudes = async (req, res) => {
  try {
    const etudes = await Etude.findAll({
      include: [
        {
          model: Seance,
          as: 'seances', // Specify the alias used in the association
        },
        {
          model: Enseignant, // Include the Enseignant model
          as: 'enseignant', // Specify the alias for the Enseignant association
          attributes: ['nom', 'prenom'], // Select only the 'nom' and 'prenom' attributes
        },
      ], //
       // Include associated Seances
    });
    res.status(200).json(etudes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch Etudes' });
  }
};

// Get a specific Etude by ID with associated Seances
exports.getEtudeById = async (req, res) => {
  const { id } = req.params;
  try {
    const etude = await Etude.findOne({
      where: { id },
      include: Seance, // Include associated Seances
    });

    if (!etude) {
      return res.status(404).json({ error: 'Etude not found' });
    }

    res.status(200).json(etude);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch Etude' });
  }
};

// Update an Etude with new Seance dates
exports.updateEtudeWithSeances = async (req, res) => {
  const { id } = req.params;
  const { niveau, dayOfWeek, startTime, endTime, enseignantId, matiereId, seanceDates } = req.body;
  
  try {
    // Update the Etude
    const etude = await Etude.findByPk(id);
    if (!etude) {
      return res.status(404).json({ error: 'Etude not found' });
    }

    etude.niveau = niveau || etude.niveau;
    etude.dayOfWeek = dayOfWeek || etude.dayOfWeek;
    etude.startTime = startTime || etude.startTime;
    etude.endTime = endTime || etude.endTime;
    etude.enseignantId = enseignantId || etude.enseignantId;
    etude.matiereId = matiereId || etude.matiereId;
    await etude.save();

    // Remove old Seances and create new ones based on the updated dates
    await Seance.destroy({ where: { etudeId: id } });
    const formattedDates = seanceDates.map(date => moment(date, 'DD/MM').format('YYYY-MM-DD'));
    const seances = await Promise.all(
      formattedDates.map(date =>
        Seance.create({ date, etudeId: etude.id })
      )
    );

    res.status(200).json({ etude, seances });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update Etude with Seances' });
  }
};

// Delete an Etude and its associated Seances
exports.deleteEtude = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete associated Seances first
    await Seance.destroy({ where: { etudeId: id } });

    // Delete the Etude
    const etude = await Etude.findByPk(id);
    if (!etude) {
      return res.status(404).json({ error: 'Etude not found' });
    }
    await etude.destroy();

    res.status(200).json({ message: 'Etude and associated Seances deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete Etude and Seances' });
  }
};



exports.markAttendance = async (req, res) => {
  const { etudeId, seanceId } = req.params;
  const { attendance } = req.body;

  try {
    // Validate Etude and Seance existence
    const etude = await Etude.findByPk(etudeId, {
      include: [{ model: Eleve, as: 'eleves' }],
    });

    if (!etude) {
      return res.status(404).json({ error: 'Etude not found' });
    }

    const seance = await Seance.findByPk(seanceId);
    if (!seance) {
      return res.status(404).json({ error: 'Seance not found' });
    }

    // Process attendance for each student
    const updates = attendance.map(async ({ eleveId, attendanceStatus }) => {
      const eleve = await Eleve.findByPk(eleveId);
      if (!eleve) {
        return { error: `Eleve with ID ${eleveId} not found` };
      }

      // Validate if the Eleve is enrolled in this Etude
      const eleves = await etude.getEleves();
      const isEnrolled = eleves.some((e) => e.id === eleveId);
      if (!isEnrolled) {
        return { error: `Eleve with ID ${eleveId} is not enrolled in this Etude` };
      }

      // Check if attendance record exists
      const attendanceRecord = await Attendance.findOne({
        where: { eleveId, seanceId },
      });

      if (attendanceRecord) {
        // If exists, update the record
        await attendanceRecord.update({ attendanceStatus });
      } else {
        // If not exists, create with default 'present' status
        await Attendance.create({
          eleveId,
          seanceId,
          attendanceStatus: attendanceStatus || 'present',
          date: moment().format('YYYY-MM-DD'), // Default to today's date
        });
      }

      return { eleveId, attendanceStatus };
    });

    // Wait for all operations to complete
    const result = await Promise.all(updates);

    // Collect errors if any
    const errors = result.filter((item) => item.error);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    res.status(200).json({ message: 'Attendance updated successfully', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process attendance' });
  }
};
