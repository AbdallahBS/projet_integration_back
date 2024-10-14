const express = require('express');
const {
    addTeacherClasses
} = require('../controller/enseignantClasse.controller');

const router = express.Router();

router.post('/enseignantClasses', addTeacherClasses);

module.exports = router;