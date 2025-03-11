const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');

router.get('/', systemController.getDashboard);
router.get('/metrics', systemController.getMetricsData);

module.exports = router;