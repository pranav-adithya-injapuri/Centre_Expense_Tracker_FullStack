const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

router.get('/monthly', reportController.getMonthlyReport);
router.get('/category', reportController.getCategoryReport);

module.exports = router;
