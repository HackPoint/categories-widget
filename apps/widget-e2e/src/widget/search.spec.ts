import axios from 'axios';
import { CategorySearch, Category } from '@cityshob/models';

describe('GET /api/search', () => {
  it('should return all categories when category is set to "all" without searchText', async () => {
    const res = await axios.get('/api/search', { params: { category: 'all' } });

    expect(res.status).toBe(200);
    expect(res.data.length).toBeGreaterThan(0);

    res.data.forEach((category: Category) => {
      expect(category.subCategories).toBeDefined();
      expect(category.subCategories?.length).toBeGreaterThan(0);
    });
  });

  it('should return filtered results for each specific category', async () => {
    const categories: CategorySearch[] = ['zones', 'sites', 'placemarks', 'layers'];

    for (const category of categories) {
      const res = await axios.get('/api/search', { params: { category } });

      expect(res.status).toBe(200);
      expect(res.data.length).toBeGreaterThan(0);

      res.data.forEach((categoryData: Category) => {
        expect(categoryData.name).toMatch(new RegExp(`^${category}$`, 'i'));
        expect(categoryData.subCategories?.length).toBeGreaterThan(0);

        // Ensure no other categories are present in response
        const otherCategories = ['zones', 'sites', 'placemarks', 'layers'].filter(cat => cat !== category);
        otherCategories.forEach(otherCategory => {
          const otherData = categoryData.subCategories?.find(subCat => subCat.name.toLowerCase() === otherCategory);
          expect(otherData).toBeUndefined();
        });
      });
    }
  });

  it('should return results matching text in any field (free-text search)', async () => {
    const searchText = 'sensor';
    const res = await axios.get('/api/search', { params: { searchText } });

    expect(res.status).toBe(200);
    expect(res.data.length).toBeGreaterThan(0);

    res.data.forEach((category: Category) => {
      let matchFound = false;

      category.subCategories?.forEach(subCategory => {
        if (subCategory.name.toLowerCase().includes(searchText)) matchFound = true;
        subCategory.children?.forEach(child => {
          if (
            child.name.toLowerCase().includes(searchText) ||
            (child.description && child.description.toLowerCase().includes(searchText)) ||
            (child.connectionStatus && child.connectionStatus.toLowerCase().includes(searchText))
          ) {
            matchFound = true;
          }
        });
      });

      expect(matchFound).toBe(true);
    });
  });

  it('should return empty results for non-matching searchText', async () => {
    const searchText = 'nonexistenttext';
    const res = await axios.get('/api/search', { params: { searchText } });

    expect(res.status).toBe(200);
    expect(res.data.length).toBe(0);
  });

  it('should return filtered results for specific category with matching searchText', async () => {
    const category: CategorySearch = 'zones';
    const searchText = 'camera';
    const res = await axios.get('/api/search', { params: { category, searchText } });

    expect(res.status).toBe(200);
    expect(res.data.length).toBeGreaterThan(0);

    res.data.forEach((resultCategory: Category) => {
      expect(resultCategory.name.toLowerCase()).toBe(category.toLowerCase());

      let matchFound = false;

      resultCategory.subCategories?.forEach(subCategory => {
        if (subCategory.name.toLowerCase().includes(searchText)) matchFound = true;
        subCategory.children?.forEach(child => {
          if (
            child.name.toLowerCase().includes(searchText) ||
            (child.description && child.description.toLowerCase().includes(searchText)) ||
            (child.connectionStatus && child.connectionStatus.toLowerCase().includes(searchText))
          ) {
            matchFound = true;
          }
        });
      });

      expect(matchFound).toBe(true);
    });
  });

  it('should return 400 for invalid category', async () => {
    try {
      await axios.get('/api/search', { params: { category: 'invalidCategory' } });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toEqual({
        error: 'Invalid category. Use zones, sites, placemarks, layers, or all.',
      });
    }
  });

  it('should return all categories when no parameters are provided', async () => {
    const res = await axios.get('/api/search');
    expect(res.status).toBe(200);
    expect(res.data.length).toBeGreaterThan(0);

    res.data.forEach((category: Category) => {
      expect(category.subCategories).toBeDefined();
      expect(category.subCategories?.length).toBeGreaterThan(0);
    });
  });

  it('should handle case-insensitive category name in search', async () => {
    const res = await axios.get('/api/search', { params: { category: 'ZoNeS' } });

    expect(res.status).toBe(200);
    expect(res.data.length).toBeGreaterThan(0);

    res.data.forEach((category: Category) => {
      expect(category.name.toLowerCase()).toBe('zones');
    });
  });

  it('should handle mixed case searchText', async () => {
    const searchText = 'SeNsOr';
    const res = await axios.get('/api/search', { params: { searchText } });

    expect(res.status).toBe(200);
    expect(res.data.length).toBeGreaterThan(0);

    res.data.forEach((category: Category) => {
      let matchFound = false;

      category.subCategories?.forEach(subCategory => {
        if (subCategory.name.toLowerCase().includes(searchText.toLowerCase())) matchFound = true;
        subCategory.children?.forEach(child => {
          if (
            child.name.toLowerCase().includes(searchText.toLowerCase()) ||
            (child.description && child.description.toLowerCase().includes(searchText.toLowerCase()))
          ) {
            matchFound = true;
          }
        });
      });

      expect(matchFound).toBe(true);
    });
  });

  it('should return specific subCategories and children matching searchText in category with other data filtered out', async () => {
    const category: CategorySearch = 'layers';
    const searchText = 'Layer1';
    const res = await axios.get('/api/search', { params: { category, searchText } });

    expect(res.status).toBe(200);
    expect(res.data.length).toBeGreaterThan(0);

    res.data.forEach((resultCategory: Category) => {
      expect(resultCategory.subCategories).toBeDefined();

      resultCategory.subCategories?.forEach(subCategory => {
        if (subCategory.name.toLowerCase() === searchText.toLowerCase()) {
          expect(subCategory.children?.length).toBeGreaterThan(0);
        } else {
          expect(subCategory.children).toEqual([]); // Ensures non-matching subcategories have empty children
        }
      });
    });
  });
});


