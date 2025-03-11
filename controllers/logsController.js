const fs = require('fs').promises;
const path = require('path');

exports.getLogs = async (req, res) => {
    try {
        const logsPath = path.join(__dirname, '../logs');
        const metricLogs = await fs.readFile(path.join(logsPath, 'metrics.log'), 'utf8');
        const errorLogs = await fs.readFile(path.join(logsPath, 'error.log'), 'utf8');

        const metrics = metricLogs.split('\n')
            .filter(Boolean)
            .map(line => JSON.parse(line))
            .slice(-50); 

        const errors = errorLogs.split('\n')
            .filter(Boolean)
            .map(line => JSON.parse(line))
            .slice(-50); 

        res.render('logs', { metrics, errors });
    } catch (error) {
        res.status(500).render('error', {
            message: 'Error loading logs',
            error: { status: 500 }
        });
    }
};