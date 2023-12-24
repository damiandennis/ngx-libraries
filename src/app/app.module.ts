import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxListViewModule } from 'projects/ngx-list-view/src/public_api';
import { NgxSelectViewModule } from 'projects/ngx-select-view/src/public_api';
import { AccordionModule } from 'projects/ngx-simple-accordion/src/public_api';
import { NgxToastnModule } from 'projects/ngx-toastn/src/public_api';
import { HttpClientModule } from '@angular/common/http';
import { fakeBackendProvider } from './interceptors/fake-backend-http.interceptor';
import { FormsModule } from '@angular/forms';

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
    NgxToastnModule,
    FormsModule
  ],
  providers: [fakeBackendProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
