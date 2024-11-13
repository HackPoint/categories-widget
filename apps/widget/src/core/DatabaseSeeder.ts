import { generateCategoryData } from '../seed';
import { MongoDBClient } from './MongoDBClient';

export class DatabaseSeeder {
  constructor(private mongoClient: MongoDBClient) {}

  async seed(): Promise<void> {
    try {
      await this.mongoClient.connect();
      await this.mongoClient.clearCategoriesCollection();

      const categoriesCollection = this.mongoClient.getCategoriesCollection();
      await categoriesCollection.deleteMany({});

      const categoryData = generateCategoryData();
      await categoriesCollection.insertMany(categoryData);

      await categoriesCollection.createIndex({
        'name': 'text',
        'subCategories.name': 'text',
        'subCategories.children.name': 'text',
        'subCategories.children.description': 'text',
      });

      console.log(
        'MongoDB: Seeded categories data and created text index for free-text search.'
      );
    } catch (error) {
      console.error('Error in seeding:', error);
    } finally {
      await this.mongoClient.close();
    }
  }
}
