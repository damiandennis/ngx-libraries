import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgxDroplistComponent} from './components/droplist/ngx-droplist.component';
import {NgxListOneComponent} from './components/list-one/ngx-list-one.component';
import {NgxListManyComponent} from './components/list-many/ngx-list-many.component';
import {NgxSearchOneComponent} from './components/search-one/ngx-search-one.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    NgxDroplistComponent,
    NgxListOneComponent,
    NgxListManyComponent,
    NgxSearchOneComponent
  ],
  exports: [
    NgxListOneComponent,
    NgxListManyComponent,
    NgxDroplistComponent,
    NgxSearchOneComponent
  ],
  providers: [],
})
export class NgxSelectViewModule { }
