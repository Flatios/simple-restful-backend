import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import config from "./config/config.js";
import errorHandler from './middlewares/errorHandler.js';
import routes from './routes/routes.js';

const app = express();

app.use(morgan('combined'))
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);
app.use(routes);

app.listen(config.port, () => console.info(`Server running on port ${config.port}`));
