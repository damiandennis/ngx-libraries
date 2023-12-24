import {Component, Input, OnInit, EventEmitter, QueryList, ContentChildren} from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
    selector: 'ngx-list-filter',
    templateUrl: 'ngx-list-filter.component.html'
})
export class NgxListFilterComponent implements OnInit {

    @Input() public listTitle = '';
    @Input() public filterName = '';
    @Input() public items: Array<any> = [];
    @Input() public objectLabel = 'label';
    @Input() public objectValue = 'value';
    @Input() public dataService: {
        getFilters: () => Array<any>,
        setParam: (name: string, filters: any) => any,
        fetchAll: (id?: any, payloadOnly?: boolean) => any
    };
    @Input() public checkedItems: any = {};
    @Input() public filterEmitter: EventEmitter<any> = new EventEmitter<any>();
    @ContentChildren(NgModel, {descendants: true}) public modelCheckboxes: QueryList<NgModel>;
    public itemsActive = 0;
    public timeout: any;

    public ngOnInit() {
        // If data is specified and items is empty fetch and fill.
        if (this.dataService) {
            this.dataService
                .fetchAll()
                .subscribe((data: any) => {
                    this.items = data.payload;
                }, (err) => {
                    console.error(err);
                });
        }
    }

    public reset() {
        this.itemsActive = 0;
        this.checkedItems = {};
        this.modelCheckboxes.forEach((item) => {
            item.control.setValue(false, {emitViewToModelChange: false});
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
              name: this.filterName,
              value,
              operator: 'IN'
          });
          this.itemsActive = value.length;
      }, 1000);

    }

}
