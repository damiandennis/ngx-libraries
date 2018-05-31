import {Directive, Input} from '@angular/core';
import {NgForm} from '@angular/forms';

@Directive({
  // tslint:disable-next-line directive-selector
  selector: 'form[listResetForm]'
})
export class NgxListFormResetDirective {

  @Input('promptReset') reset = false;
  @Input('listResetForm') form: NgForm;

}
