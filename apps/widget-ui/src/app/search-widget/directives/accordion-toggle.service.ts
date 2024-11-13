import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccordionToggleService {
  public activeItemId: string | null = 'zonesContent';

  setActiveItem(itemId: string | null) {
    this.activeItemId = itemId;
  }

  getActiveItem(): string | null {
    return this.activeItemId;
  }
}
