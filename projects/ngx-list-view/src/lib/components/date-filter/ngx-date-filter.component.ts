import {Component, Input, EventEmitter} from '@angular/core';

@Component({
    selector: 'ngx-date-filter',
    templateUrl: 'ngx-date-filter.component.html'
})
export class NgxDateFilterComponent {

    @Input() public title: string;
    @Input() public name: string;
    public value = '';
    @Input() public filterEmitter: EventEmitter<any> = new EventEmitter<any>();

    public changeValue(value: string) {
        this.value = value;
        this.filterEmitter.emit({
            name: this.name,
            value: value,
            operator: '='
        });
    }

}
