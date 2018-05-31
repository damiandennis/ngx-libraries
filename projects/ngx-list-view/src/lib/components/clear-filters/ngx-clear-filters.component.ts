import {Component} from '@angular/core';
import {EventEmitter} from '@angular/core';
import {Input} from '@angular/core';
import {ApiFilterInterface} from '../../interfaces/api-filter.interface';

@Component({
    selector: 'ngx-clear-filters',
    templateUrl: 'ngx-clear-filters.component.html'
})
export class NgxClearFiltersComponent {

    public filter: ApiFilterInterface;
    @Input() public clearFiltersEmitter: EventEmitter<boolean>;

    public clear() {
        this.clearFiltersEmitter.emit(true);
    }
}
