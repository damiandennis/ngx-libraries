import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxListViewModule } from 'projects/ngx-list-view/src/public_api';
import { NgxSelectViewModule } from 'projects/ngx-select-view/src/public_api';
import { AccordionModule } from 'projects/ngx-simple-accordion/src/public_api';
import { NgxToastnModule } from 'projects/ngx-toastn/src/public_api';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxListViewModule,
    NgxSelectViewModule,
    AccordionModule,
    NgxToastnModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
