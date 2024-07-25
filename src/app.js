
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import errorHandler from './middleware/errorHandler.js';

import { createLogger, format, transports } from 'winston';

// Initialize Express app
const app = express();

// Middleware setup
const serverPort = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Setup Winston logger
const logger = createLogger({
  level: isProduction ? 'info' : 'debug',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [
    new transports.Console()
  ],
});

app.use(morgan('tiny', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler)


// Start server
app.listen(serverPort, () => logger.info(`Server running on port ${serverPort}`));
