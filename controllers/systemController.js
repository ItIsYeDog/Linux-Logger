const { getSystemMetrics } = require('../Utils/systemMetrics');
const logger = require('../Utils/logger');

exports.getDashboard = async (req, res) => {
    try {
        const systemInfo = await getSystemMetrics();
        logger.info('Dashboard accessed', {
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        
        res.render('dashboard', { 
            systemInfo,
            process
        });
    } catch (error) {
        logger.error('Dashboard error', { error: error.message });
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching system metrics'
        });
    }
};

exports.getMetricsData = async (req, res) => {
    try {
        const systemInfo = await getSystemMetrics();
        res.json({
            success: true,
            data: systemInfo
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching metrics data'
        });
    }
};