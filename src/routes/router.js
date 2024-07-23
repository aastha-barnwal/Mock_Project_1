const express = require('express');
const router = express.Router();
const dbSaveController = require('../controllers/dbSaveController');
const timeBasedController = require('../controllers/timeBasedController');
const dbSearchController = require('../controllers/dbSearchController');
const authController = require('../controllers/authController')

router.post('/db-save',authController.authenticateToken,dbSaveController);
router.post('/time-based-api',authController.authenticateToken,timeBasedController);
router.get('/db-search',dbSearchController);

router.get('/google', authController.signup);
router.get('/google/callback', authController.googleCallback);

module.exports=router;
