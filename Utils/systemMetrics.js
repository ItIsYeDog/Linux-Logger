const os = require('os');
const logger = require('./logger');

exports.getSystemMetrics = () => {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;
    
    cpus.forEach(cpu => {
        for (let type in cpu.times) {
            totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
    });

    const cpuLoad = 100 - (totalIdle / totalTick * 100);

    const metrics = {
        cpuUsage: process.cpuUsage(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        uptime: os.uptime(),
        platform: os.platform(),
        cpuCores: os.cpus().length,
        cpuLoad: cpuLoad,
        nodeMemory: process.memoryUsage(),
        timestamp: new Date().toISOString()
    };

    // Log metrics
    logger.info('System Metrics', { metrics });

    return metrics;
};