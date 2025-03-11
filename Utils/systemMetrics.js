const os = require('os');
const logger = require('./logger');
const nodeDiskInfo = require('node-disk-info');

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
        
        const disks = await nodeDiskInfo.getDiskInfo();
        const diskMetrics = disks.map(disk => ({
            filesystem: disk.filesystem,
            mounted: disk.mounted,
            size: disk.blocks,
            used: disk.used,
            available: disk.available,
            usedPercentage: disk.capacity,
            type: disk.type
        }));

        const metrics = {
            cpuUsage: process.cpuUsage(),
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
            uptime: os.uptime(),
            platform: os.platform(),
            cpuCores: os.cpus().length,
            cpuLoad: cpuLoad,
            nodeMemory: process.memoryUsage(),
            disks: diskMetrics,
            timestamp: new Date().toISOString()
        };

        logger.info('System Metrics', { metrics });
        return metrics;
    } catch (error) {
        logger.error('Error getting system metrics', { error: error.message });
        throw error;
    }
};