const winston = require('winston');
const path = require('path');

// Create logs directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
            level: 'warn'
        }),
        new winston.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'logs/warnings.log',
            level: 'warn'
        }),
        new winston.transports.File({ 
            filename: 'logs/metrics.log',
            level: 'info'
        })
    ]
});

module.exports = logger;