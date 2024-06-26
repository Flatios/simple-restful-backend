import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Initialize the Express app
const app: Express = express();
const port = process.env.PORT || 3000;
const routes = ['user'];

// Middleware setup
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(compression({ level: 6 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

declare module "express" { 
  export interface Request {
    user: any
  }
  export interface Response {
    user: any
  }
}

// Load routes dynamically
const loadRoutes = async () => {
  try {
    const modules = await Promise.all(routes.map(routeName => import(`./routes/${routeName}`)));
    modules.forEach(route => app.use(route.default));
  } catch (err) { 
    console.error('Route loading error:', err) 
  }
};

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  loadRoutes();
});

