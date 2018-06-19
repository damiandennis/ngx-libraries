import {ModuleWithProviders, NgModule} from '@angular/core';
import { NgxToastnComponent } from './ngx-toastn.component';
import {CommonModule} from '@angular/common';
import {NgxToastComponent} from './ngx-toast.component';
import {SafeHtmlPipe} from './shared';
import {ToastyConfig, NgxToastnService, toastyServiceFactory} from './ngx-toastn.service';

export let providers = [
  ToastyConfig,
  { provide: NgxToastnService, useFactory: toastyServiceFactory, deps: [ToastyConfig] }
];

@NgModule({
  imports: [CommonModule],
  declarations: [NgxToastnComponent, NgxToastComponent, SafeHtmlPipe],
  exports: [NgxToastnComponent, NgxToastComponent],
  providers: providers
})
export class NgxToastnModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxToastnModule,
      providers: providers
    };
  }
}
