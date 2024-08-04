import logger from '../config/logger.config.js'; 
export default (err, req, res, next) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        status: err.status || 500,
        url: req.originalUrl,
        method: req.method
    });

    res.status(err.status || 500).json({
        error: {
            message: err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};