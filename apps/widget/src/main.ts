import express from 'express';
import cors from 'cors';
import { CategoryController } from './controllers/CategoryController';
import { DataService } from './services/DataService';
import { MongoDBClient } from './core/MongoDBClient';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const mongoUri = process.env.MONGODB_URI ?? 'mongodb://root:password@localhost:27017';

async function startServer() {
  const app = express();

  app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

  app.use(express.json());

  // Initialize MongoDB client
   const mongoClient = new MongoDBClient(mongoUri);
   await mongoClient.connect();

  // Initialize services and controllers
  const widgetController = new CategoryController(mongoClient);

  app.get('/', (req, res) => {
    res.send({ message: 'Hello API' });
  });

  app.get('/api/search', (req, res) =>
    widgetController.search(req, res)
  );

  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start the server:', error);
  process.exit(1);
});
