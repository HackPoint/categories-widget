import { Injectable } from '@angular/core';

export interface SubCategory {
  name: string;
  expanded: boolean;
  loading: boolean;
  selected: boolean;
  sensors: Sensor[];
}

interface Sensor {
  name: string;
  description: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Simulated data for main categories with the first item in each category set to expanded: true
  private categoryData: { [key: string]: SubCategory[] } = {
    zones: [
      { name: 'Zone 1', expanded: true, loading: false, sensors: [], selected: false },
      { name: 'Zone 2', expanded: false, loading: false, sensors: [], selected: false },
      { name: 'Zone 3', expanded: false, loading: false, sensors: [], selected: false }
    ],
    sites: [
      { name: 'Site A', expanded: true, loading: false, sensors: [], selected: false },
      { name: 'Site B', expanded: false, loading: false, sensors: [], selected: false },
      { name: 'Site C', expanded: false, loading: false, sensors: [], selected: false }
    ],
    placemarks: [
      { name: 'Placemark Alpha', expanded: true, loading: false, sensors: [], selected: false },
      { name: 'Placemark Beta', expanded: false, loading: false, sensors: [], selected: false },
      { name: 'Placemark Gamma', expanded: false, loading: false, sensors: [], selected: false }
    ],
    layers: [
      { name: 'Layer I', expanded: true, loading: false, sensors: [], selected: false },
      { name: 'Layer II', expanded: false, loading: false, sensors: [], selected: false },
      { name: 'Layer III', expanded: false, loading: false, sensors: [], selected: false }
    ]
  };

  private sensorData: Sensor[] = [
    { name: 'Sensor 1', description: 'Temperature Sensor', status: 'Stable' },
    { name: 'Sensor 2', description: 'Humidity Sensor', status: 'Unstable' },
    { name: 'Sensor 3', description: 'Pressure Sensor', status: 'Disconnected' }
  ];

  async fetchData(category: string): Promise<SubCategory[]> {
    await this.simulateDelay(1000);
    const data = this.categoryData[category] || [];
    return data;
  }

  async fetchSubData(subCategoryName: string): Promise<Sensor[]> {
    await this.simulateDelay(800);
    return this.sensorData.map(sensor => ({ ...sensor }));
  }

  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
