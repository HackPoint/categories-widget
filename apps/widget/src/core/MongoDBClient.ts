import { MongoClient, Db, Collection } from 'mongodb';
import { Category } from '@cityshob/models';

export class MongoDBClient {
  private client: MongoClient;
  private dbName = 'cityshob';

  constructor(private uri: string) {
    this.client = new MongoClient(uri);
  }

  async connect(): Promise<void> {
    await this.client.connect();
    console.log('MongoDB: Connected');
  }

  getDatabase(): Db {
    return this.client.db(this.dbName);
  }

  getCategoriesCollection(): Collection<Category> {
    return this.getDatabase().collection<Category>('categories');
  }

  async clearCategoriesCollection(): Promise<void> {
    const widgetsCollection = this.getCategoriesCollection();
    await widgetsCollection.deleteMany({});
    console.log('MongoDB: Cleared existing data in categories collection');
  }

  async close(): Promise<void> {
    await this.client.close();
    console.log('MongoDB: Disconnected');
  }
}
