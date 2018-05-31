import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';

@Component({
    selector: 'ngx-search',
    templateUrl: 'ngx-search.component.html',
    styles: [`
        :host {
            position: relative;
            display: block;
        }
        .search-clear {
            position: absolute;
            top: 7px;
            right: 8px;
        }
        a {
            cursor: pointer;
        }
    `]
})
export class NgxSearchComponent implements OnInit {

    @Output() @Input() public searchTerm = new EventEmitter();
    @Input() public placeholder = 'Search';
    @Input() public debounceTime = 500;
    @Input() public isCustom = false;
    public classes: Array<string> = ['form-control'];
    public searchInputControl: FormControl = new FormControl();
    @Input() public target: any;

    ngOnInit() {
        // Subscribe to and debounce form control, emitting search results
        this.searchInputControl
            .valueChanges
            .pipe(debounceTime(this.debounceTime))
            .subscribe((term: string) => {
                this.searchInputControl.setValue(term, { emitEvent: false });
                if (this.target) {
                    this.target.searchTerm.emit(term);
                } else {
                    this.searchTerm.emit(term);
                }
            });
    }

    public clearSearchTerm(emit: boolean = false) {
        this.searchInputControl.setValue('', {emitEvent: emit});
    }

}
