const fs = require('fs').promises;
const path = require('path');

exports.getLogs = async (req, res) => {
    try {
        const logsPath = path.join(__dirname, '../logs');
        let metrics = [];
        let errors = [];

        try {
            await fs.access(logsPath);
        } catch {
            await fs.mkdir(logsPath);
        }

        try {
            const metricLogs = await fs.readFile(path.join(logsPath, 'metrics.log'), 'utf8');
            metrics = metricLogs.split('\n')
                .filter(Boolean)
                .map(line => JSON.parse(line))
                .slice(-50);
        } catch (error) {
            metrics = [];
        }

        try {
            const errorLogs = await fs.readFile(path.join(logsPath, 'error.log'), 'utf8');
            errors = errorLogs.split('\n')
                .filter(Boolean)
                .map(line => JSON.parse(line))
                .slice(-50);
        } catch (error) {
            errors = [];
        }

        res.render('logs', { metrics, errors });
        
    } catch (error) {
        console.error('Error loading logs:', error);
        res.status(500).render('error', {
            message: 'Error loading logs',
            error: { status: 500 }
        });
    }
};