import {Component} from '@angular/core';
import {Input} from '@angular/core';

@Component({
    selector: 'ngx-no-results',
    templateUrl: 'ngx-no-results.component.html'
})
export class NgxNoResultsComponent {
    @Input() classes: Object = 'alert alert-warning text-center';
    @Input() show = false;
}
