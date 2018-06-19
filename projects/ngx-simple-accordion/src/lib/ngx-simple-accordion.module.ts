import {NgModule} from '@angular/core';
import {NgxSimpleAccordionDirective} from './ngx-simple-accordion.directive';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NgxSimpleAccordionDirective
  ],
  exports: [
    NgxSimpleAccordionDirective
  ]
})
export class AccordionModule {}
