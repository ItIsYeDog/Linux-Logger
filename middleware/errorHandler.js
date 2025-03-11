const logger = require('../Utils/logger');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const status = err.status || 500;
    const message = err.message || 'Something went wrong!';

    logger.error('Error occurred', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query
    });

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }

    if (err.name === 'MongoError' && err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate key error'
        });
    }

    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(status).json({
            success: false,
            message: message
        });
    }

    res.status(status).render('error', {
        message: message,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
};

module.exports = errorHandler;