import { createLogger, format, transports } from 'winston';
import TransportStream from 'winston-transport';
import database from '../helper/database.js';


class MysqlTransport extends TransportStream {
    async log(info, callback) {
        setImmediate(() => this.emit('logged', info));
        const { level, message, timestamp, ...meta } = info;

        const logEntry = {
            level,
            message,
            timestamp: timestamp || new Date().toISOString(),
            meta: JSON.stringify(meta)
        };

        try {
            const result = await database.insertOne('logs', logEntry);
            if (!result) {
                throw new Error('Failed to insert log into the database');
            }
            callback();
        } catch (error) {
            console.error('Logging to MySQL failed:', error);
            callback(error);
        }
    }
}

const logger = createLogger({
    level: 'debug',
    format: format.json(),
    transports: [
        new transports.Console({
            format: format.combine(format.colorize(), format.simple())
        }),
        new MysqlTransport()
    ]
});

export default logger;