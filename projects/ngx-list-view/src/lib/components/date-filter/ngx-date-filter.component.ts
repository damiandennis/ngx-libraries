import {Component, Input, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'ngx-date-filter',
  templateUrl: 'ngx-date-filter.component.html',
  styleUrls: ['ngx-date-filter.component.scss']
})
export class NgxDateFilterComponent implements OnInit {

  @Input() public title: string;
  @Input() public name: string;
  @Input() public classes: string;
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

  public reset() {
    this.value = '';
  }

  ngOnInit(): void {
      if (this.classes === undefined) {
        this.classes = 'form-control date-filter'
      }
  }

}
