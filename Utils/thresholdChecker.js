const logger = require('./logger');

const THRESHOLDS = {
    CPU_LOAD: 25,
    MEMORY_USAGE: 40,
    DISK_USAGE: 90
};

exports.checkThresholds = (metrics) => {
    const memoryUsagePercent = ((metrics.totalMemory - metrics.freeMemory) / metrics.totalMemory) * 100;
    
    if (metrics.cpuLoad > THRESHOLDS.CPU_LOAD) {
        logger.warn('High CPU Usage', {
            cpuLoad: `${metrics.cpuLoad.toFixed(2)}%`,
            threshold: `${THRESHOLDS.CPU_LOAD}%`,
            timestamp: new Date().toISOString()
        });
    }

    if (memoryUsagePercent > THRESHOLDS.MEMORY_USAGE) {
        logger.warn('High Memory Usage', {
            memoryUsage: `${memoryUsagePercent.toFixed(2)}%`,
            freeMemory: `${(metrics.freeMemory / 1024 / 1024 / 1024).toFixed(2)} GB`,
            threshold: `${THRESHOLDS.MEMORY_USAGE}%`,
            timestamp: new Date().toISOString()
        });
    }

    if (metrics.diskIO?.filesystems) {
        metrics.diskIO.filesystems.forEach(fs => {
            const usedPercent = (fs.used / fs.size) * 100;
            if (usedPercent > THRESHOLDS.DISK_USAGE) {
                logger.warn('High Disk Usage', {
                    filesystem: fs.mount,
                    usagePercent: `${usedPercent.toFixed(2)}%`,
                    available: `${fs.available} GB`,
                    threshold: `${THRESHOLDS.DISK_USAGE}%`,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }
};