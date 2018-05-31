import { NgModule } from '@angular/core';
import {NgxClearFiltersComponent} from './components/clear-filters/ngx-clear-filters.component';
import {NgxListPreviewComponent} from './components/list-preview/ngx-list-preview.component';
import {NgxCounterComponent} from './components/counter/ngx-counter.component';
import {NgxListViewComponent} from './components/list-view/ngx-list-view.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxNotFoundComponent} from './components/not-found/ngx-not-found.component';
import {NgxSearchComponent} from './components/search/ngx-search.component';
import {NgxPaginationComponent} from './components/pagination/ngx-pagination.component';
import {NgxShowMoreComponent} from './components/show-more/ngx-show-more.component';
import {NgxNoResultsComponent} from './components/no-results/ngx-no-results.component';
import {NgxIcheckDirective} from './directives/ngx-icheck.directive';
import {NgxListFilterComponent} from './components/list-filter/ngx-list-filter.component';
import {NgxListFormResetDirective} from './directives/ngx-list-form-reset.directive';
import {NgxDateFilterComponent} from './components/date-filter/ngx-date-filter.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    NgxClearFiltersComponent,
    NgxCounterComponent,
    NgxListPreviewComponent,
    NgxListViewComponent,
    NgxNoResultsComponent,
    NgxNotFoundComponent,
    NgxPaginationComponent,
    NgxSearchComponent,
    NgxShowMoreComponent,
    NgxIcheckDirective,
    NgxListFilterComponent,
    NgxDateFilterComponent,
    NgxListFormResetDirective
  ],
  exports: [
    NgxClearFiltersComponent,
    NgxCounterComponent,
    NgxListPreviewComponent,
    NgxListViewComponent,
    NgxNoResultsComponent,
    NgxNotFoundComponent,
    NgxPaginationComponent,
    NgxSearchComponent,
    NgxShowMoreComponent,
    NgxListFilterComponent,
    NgxDateFilterComponent,
    NgxListFormResetDirective
  ]
})
export class NgxListViewModule { }
