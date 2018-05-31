import {Component, Input} from '@angular/core';

@Component({
    selector: 'ngx-counter',
    templateUrl: 'ngx-counter.component.html'
})
export class NgxCounterComponent {
    @Input() start = 1;
    @Input() end = 1;
    @Input() total = 0;
    @Input() label = '';
    @Input() customTemplate = false;
}
