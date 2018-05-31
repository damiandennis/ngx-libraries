import {Component} from '@angular/core';
import {Input} from '@angular/core';

@Component({
    selector: 'ngx-not-found',
    templateUrl: 'ngx-not-found.component.html'
})
export class NgxNotFoundComponent {
    @Input() classes: Object = 'alert alert-warning text-center';
    @Input() show = false;
}
