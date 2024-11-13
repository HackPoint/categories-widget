import { Category, SearchParams } from '@cityshob/models';
import { MongoDBClient } from '../core/MongoDBClient';

export class DataService {
  constructor(private mongoClient: MongoDBClient) {}

  public async search(params: SearchParams): Promise<Category[]> {
    return this.searchInMongoDB(params);
  }

  private async searchInMongoDB(params: SearchParams): Promise<Category[]> {
    const collection = this.mongoClient.getCategoriesCollection();
    const pipeline = [];

    // Handle case-insensitive category matching
    if (params.category && params.category !== 'all') {
      pipeline.push({
        $match: {
          name: { $regex: new RegExp(`^${params.category}$`, 'i') },
        },
      });
    }

    if (params.searchText) {
      const searchRegex = new RegExp(params.searchText, 'i');

      pipeline.push({
        $addFields: {
          subCategories: {
            $map: {
              input: '$subCategories',
              as: 'subCategory',
              in: {
                $mergeObjects: [
                  '$$subCategory',
                  {
                    children: {
                      $cond: {
                        if: { $regexMatch: { input: '$$subCategory.name', regex: searchRegex } },
                        then: '$$subCategory.children',
                        else: {
                          $filter: {
                            input: '$$subCategory.children',
                            as: 'child',
                            cond: {
                              $or: [
                                { $regexMatch: { input: '$$child.name', regex: searchRegex } },
                                { $regexMatch: { input: '$$child.description', regex: searchRegex } },
                                { $regexMatch: { input: '$$child.connectionStatus', regex: searchRegex } },
                              ],
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      });

      pipeline.push({
        $match: {
          subCategories: { $elemMatch: { children: { $ne: [] } } },
        },
      });
    }

    const categories = await collection.aggregate(pipeline).toArray();
    return categories as Category[];
  }
}
