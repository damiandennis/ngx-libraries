import {Component, Input, EventEmitter, AfterContentInit, ContentChild, Output} from '@angular/core';
import {ContentChildren, QueryList, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiFilterInterface} from '../../interfaces/api-filter.interface';
import {NgxPaginationComponent} from '../pagination/ngx-pagination.component';
import {NgxSearchComponent} from '../search/ngx-search.component';
import {NgxCounterComponent} from '../counter/ngx-counter.component';
import {NgxListPreviewComponent} from '../list-preview/ngx-list-preview.component';
import {NgxNotFoundComponent} from '../not-found/ngx-not-found.component';
import {NgxNoResultsComponent} from '../no-results/ngx-no-results.component';
import {NgxClearFiltersComponent} from '../clear-filters/ngx-clear-filters.component';
import {NgxShowMoreComponent} from '../show-more/ngx-show-more.component';
import {NgxListFilterComponent} from '../list-filter/ngx-list-filter.component';
import {NgxDateFilterComponent} from '../date-filter/ngx-date-filter.component';

/**
 * This component is a container for managing list view components together.
 * Its purpose is to manage and disperse data from a single location making management easier.
 *
 * Basic Example Usage
 * -------------
 *
 * Component TS
 *
 * @Component({
 *    selector: 'app-my-component',
 *    template: `
 *        <ngx-list-view #list [dataService]='userService'>
 *          <ngx-pagination></ngx-pagination>
 *          <div *ngFor='let row of list.rows'>
 *            {{row.firstName}}
 *          </div>
 *        </ngx-list-view>
 *    `,
 *
 * })
 * class MyComponent {
 *     constructor(public userService: UserService) {}
 * }
 *
 */
@Component({
  selector: 'ngx-list-view',
  templateUrl: 'ngx-list-view.component.html',

})
export class NgxListViewComponent implements OnInit, AfterContentInit {

  /*
   * Emitters for communication with child components.
   */
  @Input() public dataService: {
    getFilters: () => Array<any>,
    setParam: (name: string, filters: any) => any,
    primaryKey: () => string
  };
  @Input() public changePageEmitter = new EventEmitter();
  @Input() public searchTerm = new EventEmitter();
  @Input() public filtersEmitter = new EventEmitter();
  @Input() public filterEmitter = new EventEmitter();
  @Input() public clearFiltersEmitter = new EventEmitter();
  @Input() public listPreviewVisibleEmitter = new EventEmitter();
  @Input() public activeRowEmitter = new EventEmitter();
  @Input() public loadMoreEmitter = new EventEmitter();
  @Input() public pageChangeScrollTop = false;
  @Input() public transformData: (data: Array<any>) => Array<any>;
  @Output('handleRequestError') public handleRequestErrorEmitter = new EventEmitter();
  public filters: Array<ApiFilterInterface> = [];
  public currentPage = 1;
  public loading = true;
  public pageCount: number;
  public meta = {};
  public rows: Array<any> = [];
  public activeRow: any;
  @Input() public previewHidden = true;

  /*
   * Direct references to child components.
   */
  @ContentChildren(NgxCounterComponent, {descendants: true}) public counterComponents: QueryList<NgxCounterComponent>;
  @ContentChild(NgxSearchComponent, {static: false}) public searchComponent: NgxSearchComponent;
  @ContentChildren(NgxPaginationComponent, {descendants: true}) public paginationComponent: QueryList<NgxPaginationComponent>;
  @ContentChild(NgxNotFoundComponent, {static: false}) public notFoundComponent: NgxNotFoundComponent;
  @ContentChild(NgxNoResultsComponent, {static: false}) public noResultsComponent: NgxNoResultsComponent;
  @ContentChildren(NgxClearFiltersComponent, {descendants: true}) public clearFiltersComponent: QueryList<NgxClearFiltersComponent>;
  @ContentChildren(NgxListFilterComponent, {descendants: true}) public listFiltersComponent: QueryList<NgxListFilterComponent>;
  @ContentChildren(NgxDateFilterComponent, {descendants: true}) public dateFiltersComponent: QueryList<NgxDateFilterComponent>;
  @ContentChild(NgxListPreviewComponent, {static: false}) public listPreviewComponent: NgxListPreviewComponent;
  @ContentChild(NgxShowMoreComponent, {static: false}) public showMoreComponent: NgxShowMoreComponent;

  public originalFilters: Array<ApiFilterInterface> = [];
  public dataSource: Observable<any>;
  public lastSearch = '';
  public updating = false;
  public activeID: number;

  /**
   * @inheritdoc
   */
  ngOnInit() {

    this.filters = this.dataService.getFilters();

    // Fetch original filters for reset.
    this.originalFilters = JSON.parse(JSON.stringify(this.filters));
    this.dataSource = this.dataService.setParam('filters', this.filters).fetchAll();

    // Subscription to page change triggered by `pagination` component
    this.changePageEmitter.subscribe((page: number) => {
      this.updating = true;
      this.dataSource = this.dataService.setParam('page', page).fetchAll();
      this.updateSubscriptions().then(() => {
        if (this.pageChangeScrollTop) {
          document.body.scrollTop = 0;
        }
      });
    });

    // Subscription to search term change triggered by `search` component
    this.searchTerm.subscribe((term: string) => {
      // Record last search
      this.lastSearch = term;
      // Reset pagination back to first page
      this.dataService.setParam('page', 1);

      // Add search term to filters array
      this.applyUniqueFilter({
        name: 'searchField',
        value: term,
        operator: '='
      });

      // Reapply filters
      this.applyFilters();
    });

    // An event to change all filters.
    this.filtersEmitter.subscribe((filters: Array<ApiFilterInterface>) => {
      // Set all emitter filters to filter array
      this.filters = filters;
      // Reapply filters
      this.applyFilters();
    });

    this.filterEmitter.subscribe((filter: ApiFilterInterface) => {
      // Push emitted filter to filter array
      this.applyUniqueFilter(filter);
      // Reapply filters
      this.applyFilters();
    });

    // An event to clear all filters.
    this.clearFiltersEmitter.subscribe((clear: boolean) => {
      this.clearFilters(clear);
    });

    this.listPreviewVisibleEmitter.subscribe((hidden: any) => {
      this.listPreviewComponent.hidden = hidden;
      this.previewHidden = hidden;
    });

    this.activeRowEmitter.subscribe((row: any) => {
      this.activeID = row[this.dataService.primaryKey()];
      this.listPreviewComponent.data = row;
    });

    this.loadMoreEmitter.subscribe(() => {
      if (this.currentPage !== this.pageCount) {
        this.dataService.setParam('page', ++this.currentPage);
        this.applyFilters(true);
      }
    });
  }

  /**
   * Resets the page index back to zero.
   *
   * @param withRefresh whether to refresh or wait.
   */
  public resetPageIndex(withRefresh = false) {
    this.currentPage = 1;
    this.dataService.setParam('page', 1);
    if (withRefresh) {
      this.refresh();
    }
  }

  /**
   * @inheritdoc
   */
  ngAfterContentInit() {
    // Sync data to child components
    setTimeout(() => this.updateSubscriptions());
  }

  /**
   * Refreshes the list.
   */
  public refresh(hidePreview: boolean = true) {
    this.updating = true;
    return this.updateSubscriptions(false, hidePreview);
  }

  /**
   * Changes all filters.
   *
   * @param filters
   */
  public replaceFilters(filters: Array<ApiFilterInterface>) {
    this.filters = filters;
    this.applyFilters();
  }

  /**
   * Resets the data source back to default with filters if defined.
   *
   * @param filters
   */
  public resetDataSource(filters: Array<ApiFilterInterface> = null) {
    if (filters !== null) {
      this.originalFilters = filters;
    }
    this.clearFilters(true);
  }

  /**
   * Makes sure that filter is unique. Updates existing if already exists.
   *
   * @param filter
   */
  public applyUniqueFilter(filter: ApiFilterInterface) {
    const item = this.filters.findIndex((findItem: any): boolean => findItem.name === filter.name);
    if (item === -1) {
      this.filters.push(filter);
    } else {
      this.filters[item] = filter;
    }
  }


  /**
   * Applys filters and update subscriptions.
   */
  public applyFilters(append: boolean = false) {
    // Apply filters to data service
    this.updating = true;
    if (!append) {
      this.dataSource = this.dataService
      .setParam('page', 1);
    }
    this.dataSource = this.dataService
      .setParam('filters', this.filters)
      .fetchAll();
    this.updateSubscriptions(append);
  }

  /**
   * Clears all filters stored against this list view.
   *
   * @param clear
   */
  public clearFilters(clear: boolean) {

    this.currentPage = 1;
    this.dataService.setParam('page', this.currentPage);

    // Clear filters here (on the parent)
    this.filters = clear ? JSON.parse(JSON.stringify(this.originalFilters)) : this.filters;
    // Clear filters for `search` component
    if (this.searchComponent) {
      this.searchComponent.clearSearchTerm();
    }
    if (this.listFiltersComponent) {
      this.listFiltersComponent.forEach((component) => component.reset());
    }
    if (this.dateFiltersComponent) {
      this.dateFiltersComponent.forEach((component) => component.reset());
    }

    // Reapply filters
    this.applyFilters();
  }

  /**
   * Syncs all data to child components
   */
  public updateSubscriptions(append: boolean = false, hidePreview: boolean = true) {
    return new Promise((resolve, reject) => {
      this.dataSource.subscribe(
        (data: any) => {
          this.loading = false;
          this.updating = false;
          this.meta = data.meta;

          let payload = data.payload;
          if (this.transformData !== undefined) {
            payload = this.transformData(payload);
          }

          if (append) {
            this.rows = this.rows.concat(payload);
          } else {
            this.rows = payload;
          }

          this.currentPage = data.meta.page;
          this.pageCount = data.meta.pageCount;
          this.initSearchComponent();
          this.initPaginationComponent(data);
          this.initCounterComponent(data);
          this.initNotFoundComponent(data);
          this.initNoResultsComponent(data);
          this.initClearFiltersComponent();
          this.initListFiltersComponent();
          this.initDateFiltersComponent();
          this.initListPreviewComponent(hidePreview);
          this.initShowMoreComponent(data);
          resolve(true);
        },
        (error) => {
          this.handleRequestErrorEmitter.emit(error);
          reject(error);
        }
      );
    });
  }

  /**
   * Initiates SearchComponent sub component.
   */
  public initSearchComponent(): void {
    // Data for `search` component
    if (this.searchComponent) {
      if (this.searchComponent.target === this || this.searchComponent.target === undefined) {
        this.searchComponent.searchTerm = this.searchTerm;
      }
    }
  }

  /**
   * Initiates PaginationComponent sub component.
   */
  public initPaginationComponent(data: any): void {

    const page = Number(data.meta.page);
    const pageCount = Number(data.meta.pageCount);

    // Data for `pagination` component
    if (this.paginationComponent) {
      this.paginationComponent.forEach((component: NgxPaginationComponent) => {
        component.changePageEmitter = this.changePageEmitter;
        component.page = page;
        component.pageCount = pageCount;
        component.pages = component.updatePagination();
      });
    }
  }

  /**
   * Initiates CounterComponent sub component.
   */
  public initCounterComponent(data: any): void {

    const page = +data.meta.page;
    const perPage = +data.meta.perPage;
    const totalCount = +data.meta.totalCount;

    const start = page * perPage - perPage + 1;
    const end = page * perPage;

    // Data for `counter` component
    if (this.counterComponents) {
      this.counterComponents.forEach((component: NgxCounterComponent) => {
        component.start = start;
        component.end = end > totalCount ? totalCount : end;
        component.total = totalCount;
      });
    }
  }

  /**
   * Checks if the current list has been filtered in any way.
   * @returns boolean
   */
  public isFiltered() {
    const noFilters = JSON.stringify(this.filters) === JSON.stringify(this.originalFilters);
    return this.lastSearch.length !== 0 || !noFilters;
  }

  /**
   * Initiates NotFoundComponent sub component.
   */
  public initNotFoundComponent(data: any): void {
    // Data for `not-found` component
    if (this.notFoundComponent) {
      this.notFoundComponent.show = this.isFiltered() && data.payload.length === 0;
    }
  }

  /**
   * Initiates NoResultsComponent sub component.
   */
  public initNoResultsComponent(data: any): void {
    // Data for `no-results` component
    if (this.noResultsComponent) {
      this.noResultsComponent.show = data.payload.length === 0 && !this.isFiltered();
    }
  }

  /**
   * Initiates ClearFiltersComponent sub component.
   */
  public initClearFiltersComponent(): void {
    // Data for `clear-filters` component
    if (this.clearFiltersComponent) {
      this.clearFiltersComponent.forEach((component: any) => {
        component.clearFiltersEmitter = this.clearFiltersEmitter;
      });
    }
  }

  /**
   * Initiates ListFiltersComponent sub component.
   */
  public initListFiltersComponent(): void {
    if (this.listFiltersComponent) {
      this.listFiltersComponent.forEach((component: any) => {
        component.filterEmitter = this.filterEmitter;
      });
    }
  }

  /**
   * Initiates DateFiltersComponent sub component.
   */
  public initDateFiltersComponent(): void {
    if (this.dateFiltersComponent) {
      this.dateFiltersComponent.forEach((component: any) => {
        component.filterEmitter = this.filterEmitter;
      });
    }
  }

  /**
   * Initiates ListPreviewComponent sub component.
   */
  public initListPreviewComponent(hidePreview: boolean = true): void {
    if (this.listPreviewComponent) {
      this.listPreviewComponent.visibleEmitter = this.listPreviewVisibleEmitter;
      this.listPreviewComponent.dataEmitter = this.activeRowEmitter;
      this.listPreviewVisibleEmitter.emit(hidePreview);
      if (this.activeID && !hidePreview) {
        const data = this.rows.find((row: any) => {
          if (row[this.dataService.primaryKey()] === this.activeID) {
            return true;
          }
        });
        if (data) {
          this.setActiveRow(data);
        }
      }
    }
  }

  /**
   * Initiate Show more sub component.
   *
   * @param data
   */
  public initShowMoreComponent(data: any): void {
    if (this.showMoreComponent) {
      const page = Number(data.meta.page);
      const pageCount = Number(data.meta.pageCount);
      const totalCount = Number(data.meta.totalCount);
      this.showMoreComponent.loadMoreEmitter = this.loadMoreEmitter;
      this.showMoreComponent.moreResults = page !== pageCount && totalCount !== 0;

    }
  }

  /**
   * Toggles the visibility of the list preview component.
   */
  public togglePreviewVisibility() {
    this.previewHidden = !this.previewHidden;
    this.listPreviewVisibleEmitter.emit(this.previewHidden);
  }

  /**
   * Sets the current row as active.
   *
   * @param row
   * @param Event event
   * @return boolean
   */
  public setActiveRow(row: any, event?: Event) {

    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (this.listPreviewComponent && this.listPreviewComponent.shouldPromptReset()) {
      if (!window.confirm('Your unsaved changes will be reset, continue?')) {
        return false;
      }
    }

    if (!this.isActiveRow(row)) {
      this.activeRow = row;
      this.activeRowEmitter.emit(row);
      if (this.isPreviewHidden()) {
        this.togglePreviewVisibility();
      }
    } else {
      this.togglePreviewVisibility();
    }
    return true;
  }

  /**
   * Checks if the current row is the active one.
   *
   * @param row
   * @returns boolean
   */
  public isActiveRow(row: any) {
    return this.activeRow === row && !this.isPreviewHidden();
  }

  /**
   * Checks if the preview is hidden.
   *
   * @returns boolean
   */
  public isPreviewHidden() {
    return this.previewHidden;
  }

}
