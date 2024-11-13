import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchParams, Category, CategorySearch } from '@cityshob/models';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class WidgetSearchService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api';

  private categoriesSignal = signal<Category[]>([]);
  private searchParamsSubject = new BehaviorSubject<SearchParams | null>(null);

  categories$ = toObservable(this.categoriesSignal);

  constructor() {
    this.searchParamsSubject
      .asObservable()
      .pipe(
        switchMap((params) => (params ? this.fetchCategories(params) : of([]))),
        tap((categories) => this.categoriesSignal.set(categories)),
        catchError((error) => {
          console.error('Error fetching categories:', error);
          return throwError(() => new Error('Error fetching categories'));
        })
      )
      .subscribe();
  }

  search(params: SearchParams): void {
    this.searchParamsSubject.next(params);
  }

  private fetchCategories(params: SearchParams): Observable<Category[]> {
    let url = `${this.apiUrl}/search?searchText=${encodeURIComponent(
      params.searchText
    )}`;

    if (params.category !== 'all') {
      url += `&category=${params.category}`;
    }

    return this.http.get<Category[]>(url).pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Error during API call:', error);
        return throwError(() => new Error('Failed to retrieve categories from DB'));
      })
    );
  }

  getCategories(): Category[] {
    return this.categoriesSignal();
  }

  fetchInitialData(category: CategorySearch): Observable<Category[]> {
    const url = `${this.apiUrl}/search?category=${category}`;
    return this.http.get<Category[]>(url).pipe(
      tap((data) => this.categoriesSignal.set(data)),  // Directly update the signal
      catchError((error) => {
        console.error(`Error fetching initial data for category: ${category}`, error);
        return throwError(() => new Error(`Failed to load category data for ${category}`));
      })
    );
  }
}
