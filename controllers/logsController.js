const fs = require('fs').promises;
const path = require('path');

exports.getLogs = async (req, res) => {
    try {
        const logsPath = path.join(__dirname, '../logs');
        let metrics = [];
        let warnings = [];

        // Create logs directory if it doesn't exist
        try {
            await fs.access(logsPath);
        } catch {
            await fs.mkdir(logsPath);
        }

        // Get system metrics summaries
        try {
            const metricLogs = await fs.readFile(path.join(logsPath, 'metrics.log'), 'utf8');
            metrics = metricLogs.split('\n')
                .filter(Boolean)
                .map(line => JSON.parse(line))
                .filter(log => log.message === 'System Metrics Summary')
                .slice(-50);
        } catch (error) {
            metrics = [];
        }

        // Get warnings
        try {
            const warningLogs = await fs.readFile(path.join(logsPath, 'warnings.log'), 'utf8');
            warnings = warningLogs.split('\n')
                .filter(Boolean)
                .map(line => JSON.parse(line))
                .slice(-50);
        } catch (error) {
            warnings = [];
        }

        res.render('logs', { 
            metrics, 
            warnings,
            currentTime: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error loading logs:', error);
        res.status(500).render('error', {
            message: 'Error loading logs',
            error: { status: 500 }
        });
    }
};