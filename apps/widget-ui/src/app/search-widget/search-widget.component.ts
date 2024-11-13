import {
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetSearchService } from './services/widget-search.service';
import { Category, SearchParams, CategorySearch, SubCategory } from '@cityshob/models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-widget.component.html',
  styleUrls: ['./search-widget.component.scss'],
})
export class SearchWidgetComponent implements OnInit {
  private widgetService = inject(WidgetSearchService);

  categories$ = this.widgetService.categories$;

  // UI State using signals
  dropdownOpen = signal(false);
  activeCategory = signal<CategorySearch>('zones');  // Updated to use CategorySearch type
  searchText = signal<string>('');
  loading = signal<boolean>(false);

  // Track the currently expanded pane index
  expandedPaneIndex = signal<number | null>(null);
  expandedSubCategoryIndex = signal<number | null>(null);

  categories: CategorySearch[] = ['all', 'zones', 'sites', 'placemarks', 'layers'];

  ngOnInit() {
    this.fetchInitialData(this.activeCategory());
  }

  searchWidgets(): void {
    const params: SearchParams = {
      category: this.activeCategory(),
      searchText: this.searchText(),
    };
    this.widgetService.search(params);
  }

  fetchInitialData(category: CategorySearch): void {
    this.loading.set(true);
    this.widgetService.fetchInitialData(category).subscribe({
      next: () => {
        this.loading.set(false);
        this.expandedPaneIndex.set(0);
          const widgets = this.widgetService.getCategories();
          if (widgets[0]?.subCategories?.length) {
            this.expandedSubCategoryIndex.set(0);
          }
      },
      error: (error) => {
        console.error('Failed to load initial data:', error);
        this.loading.set(false);
      },
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen.update((open) => !open);
  }

  selectCategory(category: CategorySearch): void {
    this.activeCategory.set(category);
    this.dropdownOpen.set(false);
    this.fetchInitialData(category);
  }

  handleSearchInput(freeText: string): void {
    this.searchText.set(freeText);
    this.searchWidgets();
  }

  // Toggle the expanded state of the specified category pane
  toggleCategory(categoryIndex: number): void {
    this.expandedPaneIndex.update((currentIndex) => (currentIndex === categoryIndex ? null : categoryIndex));
    this.expandedSubCategoryIndex.set(null);  // Reset subcategory expansion when toggling main category
  }

  // Returns the currently expanded pane index
  expandedPane(): number | null {
    return this.expandedPaneIndex();
  }

  // Toggle the selection and expanded state of a subcategory
  toggleSubCategory(subCategoryIndex: number): void {
    this.expandedSubCategoryIndex.update((currentIndex) => (currentIndex === subCategoryIndex ? null : subCategoryIndex));
  }

  expandedSubCategory(): number | null {
    return this.expandedSubCategoryIndex();
  }

  toggleSelection(subCategory: SubCategory): void {
    subCategory.selected = !subCategory.selected;
  }
}
