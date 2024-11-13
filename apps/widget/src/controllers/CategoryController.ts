import { Request, Response } from 'express';
import { DataService } from '../services/DataService';
import { MongoDBClient } from '../core/MongoDBClient';
import { CategorySearch, SearchParams } from '@cityshob/models';

export class CategoryController {
  private dataService: DataService;

  constructor(mongoClient: MongoDBClient) {
    this.dataService = new DataService(mongoClient);
  }

  public async search(req: Request, res: Response): Promise<void> {
    try {
      const { category = 'all', searchText = '' } = req.query;
      const searchParams: SearchParams = {
        category: category as CategorySearch,
        searchText: searchText.toString()
      };

      const results = await this.dataService.search(searchParams);
      res.status(200).json(results);
    } catch (error) {
      console.error('Error during search:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
