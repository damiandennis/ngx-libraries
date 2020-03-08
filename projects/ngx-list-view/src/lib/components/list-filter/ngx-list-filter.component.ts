import {Component, Input, OnInit, EventEmitter, QueryList, ContentChildren} from '@angular/core';
import {NgxIcheckDirective} from '../../directives/ngx-icheck.directive';

@Component({
    selector: 'ngx-list-filter',
    templateUrl: 'ngx-list-filter.component.html'
})
export class NgxListFilterComponent implements OnInit {

    @Input() public title = '';
    @Input() public name = '';
    @Input() public items: Array<any> = [];
    @Input() public displayName = 'label';
    @Input() public value = 'value';
    @Input() public dataService: {
        getFilters: () => Array<any>,
        setParam: (name: string, filters: any) => any,
        fetchAll: (id?: any, payloadOnly?: boolean) => any
    };
    @Input() public checkedItems: any = {};
    @Input() public filterEmitter: EventEmitter<any> = new EventEmitter<any>();
    @ContentChildren(NgxIcheckDirective) public checkboxes: QueryList<NgxIcheckDirective>;
    public itemsActive = 0;
    public timeout: any;
    public menuShown = false;

    public ngOnInit() {

        // If data is specified and items is empty fetch and fill.
        if (this.dataService) {
            this.dataService
                .fetchAll()
                .subscribe((data: any) => {
                    this.items = data.payload;
                });
        }
    }

    public reset() {
        this.itemsActive = 0;
        this.checkedItems = {};
        this.checkboxes.forEach((item) => {
            item.unCheck();
        });
    }

    /**
     * When a filter is made active or deactivated.
     *
     * @param name The name of the item.
     * @param event The filter returned.
     */
    public rowChecked(name: string, event: Event) {
        this.checkedItems[name] = event;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          const value = Object.keys(this.checkedItems)
            .reduce((accum, key) => {
              if (this.checkedItems[key]) {
                accum.push(key);
              }
              return accum;
            }, []);

          this.filterEmitter.emit({
              name: this.name,
              value: value,
              operator: 'IN'
          });
          this.itemsActive = value.length;
      }, 1000);

    }

    public toggleClickMenu(e: Event) {
        e.stopPropagation();
        e.preventDefault();
        this.menuShown = !this.menuShown;
    }

    public closeMenu(e: Event) {
        this.menuShown = false;
    }

    public showDropDown() {
        return this.menuShown ? 'block' : 'hide';
    }

}
