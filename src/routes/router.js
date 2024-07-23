const express = require('express');
const router = express.Router();
const dbSaveController = require('../controllers/dbSaveController');
const timeBasedController = require('../controllers/timeBasedController');
const dbSearchController = require('../controllers/dbSearchController');

router.post('/db-save', dbSaveController);
router.post('/time-based-api', timeBasedController);
router.get('/db-search', dbSearchController);

const authController = require('../controllers/authController')

router.get('/google', authController.signup);
router.get('/google/callback', authController.googleCallback);

module.exports=router;
