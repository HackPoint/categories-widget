export type ConnectionStatus = 'Stable' | 'Unstable' | 'Disconnected';

export interface SearchParams {
  category: CategorySearch;
  searchText: string;
}

export type CategorySearch =
  | 'zones'
  | 'sites'
  | 'placemarks'
  | 'layers'
  | 'all';

interface ObjectEntity {
  id: string;
  name: string;
  selected?: boolean;
}

export type Category = Partial<ObjectEntity> & {
  expanded?: boolean;
  subCategories?: SubCategory[];
};

export type SubCategory = ObjectEntity & {
  expanded?: boolean;
  children?: CategoryChild[];
};

export type CategoryChild = ObjectEntity & {
  description?: string;
  connectionStatus?: ConnectionStatus;
  selected: boolean;
};
