import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import morgan from 'morgan';

// Initialize the Express app
const app: Express = express();
const port = process.env.PORT || 3000;
const routes = ['user'];

// Middleware setup
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(compression({ level: 6 }));
app.use(bodyParser.json({ limit: '30mb' }));

//X
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

