const os = require('os');
const logger = require('./logger');
const si = require('systeminformation');
const { checkThresholds } = require('./thresholdChecker');


let lastLogTime = 0;
function shouldLogMetrics() {
    const now = Date.now();
    const FIVE_MINUTES = 5 * 60 * 1000;
    
    if (now - lastLogTime >= FIVE_MINUTES) {
        lastLogTime = now;
        return true;
    }
    return false;
}

exports.getSystemMetrics = async () => {
    try {
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
        
        let diskMetrics = {
            totalRead: '0',
            totalWrite: '0',
            readsPerSecond: 0,
            writesPerSecond: 0,
            filesystems: []
        };

        try {
            const [diskIO, fsSize] = await Promise.all([
                si.disksIO(),
                si.fsSize()
            ]);

            diskMetrics = {
                totalRead: diskIO && typeof diskIO.totalRead === 'number' 
                    ? (diskIO.totalRead / (1024 * 1024)).toFixed(2)
                    : '0',
                totalWrite: diskIO && typeof diskIO.totalWrite === 'number'
                    ? (diskIO.totalWrite / (1024 * 1024)).toFixed(2)
                    : '0',
                readsPerSecond: diskIO?.rIO || 0,
                writesPerSecond: diskIO?.wIO || 0,
                filesystems: fsSize.map(fs => ({
                    fs: fs.fs,
                    type: fs.type,
                    mount: fs.mount,
                    size: (fs.size / (1024 * 1024 * 1024)).toFixed(2),
                    used: (fs.used / (1024 * 1024 * 1024)).toFixed(2),
                    available: (fs.available / (1024 * 1024 * 1024)).toFixed(2)
                }))
            };
        } catch (diskError) {
            logger.error('Error getting disk metrics', { error: diskError.message });
        }

        const metrics = {
            cpuUsage: process.cpuUsage(),
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
            uptime: os.uptime(),
            platform: os.platform(),
            cpuCores: os.cpus().length,
            cpuLoad: cpuLoad,
            nodeMemory: process.memoryUsage(),
            diskIO: diskMetrics,
            timestamp: new Date().toISOString()
        };

        checkThresholds(metrics);

        if (shouldLogMetrics()) {
            logger.info('System Metrics Summary', {
                cpuLoad: `${metrics.cpuLoad.toFixed(2)}%`,
                memoryUsed: `${((metrics.totalMemory - metrics.freeMemory) / metrics.totalMemory * 100).toFixed(2)}%`,
                uptime: `${Math.floor(metrics.uptime / 3600)}h ${Math.floor((metrics.uptime % 3600) / 60)}m`,
                timestamp: metrics.timestamp
            });
        }

        //logger.info('System Metrics', { metrics });
        return metrics;
    } catch (error) {
        logger.error('Error getting system metrics', { error: error.message });
        throw error;
    }
};