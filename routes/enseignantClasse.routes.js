const express = require('express');
const {
    addTeacherClasses,
    updateEnseignantWithClasses
} = require('../controller/enseignantClasse.controller');

const router = express.Router();

router.post('/enseignantClasses', addTeacherClasses);
router.put('/enseignantClasses/:enseignantId', updateEnseignantWithClasses);

module.exports = router;