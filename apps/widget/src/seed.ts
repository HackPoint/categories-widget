import { faker } from '@faker-js/faker';
import { MongoDBClient } from './core/MongoDBClient';
import { DatabaseSeeder } from './core/DatabaseSeeder';
import { Category, ConnectionStatus } from '@cityshob/models';

const mongoUri = process.env.MONGODB_URI || 'mongodb://root:password@localhost:27017';
const mongoClient = new MongoDBClient(mongoUri);
const seeder = new DatabaseSeeder(mongoClient);

function getRandomConnectionStatus(): ConnectionStatus {
  const statuses: ConnectionStatus[] = ['Stable', 'Unstable', 'Disconnected'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

export function generateCategoryData(): Category[] {
  return [
    {
      name: 'Zones',
      expanded: true,
      subCategories: Array.from({ length: 4 }, (_, i) => ({
        id: faker.database.mongodbObjectId(),
        name: `Zone${i + 1}`,
        expanded: i === 0,
        selected: false,
        children: Array.from({ length: 4 }, (_, j) => ({
          id: faker.database.mongodbObjectId(),
          name: `Sensor${j + 1}`,
          description: `Camera${j + 1}`,
          connectionStatus: getRandomConnectionStatus(),
          selected: false,
        })),
      })),
    },
    {
      name: 'Sites',
      expanded: false,
      subCategories: Array.from({ length: 4 }, (_, i) => ({
        id: faker.database.mongodbObjectId(),
        name: `Site${i + 1}`,
        expanded: false,
        selected: false,
        children: Array.from({ length: 4 }, (_, j) => ({
          id: faker.database.mongodbObjectId(),
          name: `Sensor${j + 1}`,
          description: `Camera${j + 1}`,
          connectionStatus: getRandomConnectionStatus(),
          selected: false,
        })),
      })),
    },
    {
      name: 'Placemarks',
      expanded: false,
      subCategories: Array.from({ length: 4 }, (_, i) => ({
        id: faker.database.mongodbObjectId(),
        name: `Placemark${i + 1}`,
        expanded: false,
        selected: false,
        children: Array.from({ length: 4 }, (_, j) => ({
          id: faker.database.mongodbObjectId(),
          name: `Sensor${j + 1}`,
          description: `Camera${j + 1}`,
          connectionStatus: getRandomConnectionStatus(),
          selected: false,
        })),
      })),
    },
    {
      name: 'Layers',
      expanded: false,
      subCategories: Array.from({ length: 4 }, (_, i) => ({
        id: faker.database.mongodbObjectId(),
        name: `Layer${i + 1}`,
        expanded: false,
        selected: false,
        children: Array.from({ length: 4 }, (_, j) => ({
          id: faker.database.mongodbObjectId(),
          name: `Sensor${j + 1}`,
          description: `Camera${j + 1}`,
          connectionStatus: getRandomConnectionStatus(),
          selected: false,
        })),
      })),
    },
  ];
}

seeder.seed().then(() => {
  console.log('Seeding process completed.');
}).catch((error: Error) => {
  console.error('Seeding process failed:', error);
});
