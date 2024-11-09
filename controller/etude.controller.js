const Etude = require('../models/etude.model');
const Seance = require('../models/seance.model');
const Eleve = require('../models/eleve.model');
const Attendance = require('../models/attendance.model');

const moment = require('moment');

// Create an Etude with associated Seances
exports.createEtudeWithSeances = async (req, res) => {
  try {
    const { niveau, dayOfWeek, startTime, endTime, enseignantId, matiereId, seanceDates } = req.body;

    // Create the Etude
    const etude = await Etude.create({
      niveau,
      dayOfWeek,
      startTime,
      endTime,
      enseignantId,
      matiereId,
    });

    // Convert the seanceDates to valid ISO date format
    const formattedDates = seanceDates.map(date => moment(date, 'DD/MM').format('YYYY-MM-DD'));

    // Create Seance records and associate them with the Etude
    const seances = await Promise.all(
      formattedDates.map((date) =>
        Seance.create({ date, etudeId: etude.id })
      )
    );

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
// Get all Etudes with associated Seances
exports.getAllEtudes = async (req, res) => {
  try {
    const etudes = await Etude.findAll({
      include: Seance, // Include associated Seances
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
      // Find the Etude by ID
      const etude = await Etude.findByPk(etudeId, {
        include: [{ model: Eleve, as: 'eleves' }] // Ensure correct alias
      });
  
      if (!etude) {
        return res.status(404).json({ error: 'Etude not found' });
      }
  
      // Find the Seance by ID
      const seance = await Seance.findByPk(seanceId);
      if (!seance) {
        return res.status(404).json({ error: 'Seance not found' });
      }
  
      // Loop through each attendance record and update
      const updates = attendance.map(async ({ eleveId, attendanceStatus }) => {
        // Check if the Eleve exists
        const eleve = await Eleve.findByPk(eleveId);
        if (!eleve) {
          return { error: `Eleve with ID ${eleveId} not found` };
        }
  
        // Check if the Eleve is enrolled in the Etude
        const eleves = await etude.getEleves(); // Get the Eleves enrolled in the Etude
        const isEnrolled = eleves.some(e => e.id === eleveId); // Check if the Eleve is in the list of enrolled Eleves
  
        if (!isEnrolled) {
          return { error: `Eleve with ID ${eleveId} is not enrolled in this Etude` };
        }
    console.log(attendanceStatus);
    
        // Mark the attendance for the Eleve in the specific Seance
        await Attendance.upsert({
          eleveId,
          seanceId,
          etudeId,
          attendanceStatus,
          date: moment().format('YYYY-MM-DD'), // today's date
        });
  
        return { eleveId, attendanceStatus };
      });
  
      // Await all the updates to complete
      const result = await Promise.all(updates);
  
      // Filter out any errors
      const errors = result.filter(item => item.error);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
  
      res.status(200).json({ message: 'Attendance marked successfully', result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to mark attendance' });
    }
  };
  