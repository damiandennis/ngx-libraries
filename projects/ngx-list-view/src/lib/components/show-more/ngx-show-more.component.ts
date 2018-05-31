import {Component, EventEmitter, Input} from '@angular/core';

@Component({
    selector: 'ngx-show-more',
    templateUrl: 'ngx-show-more.component.html'
})
export class NgxShowMoreComponent {
    public moreResults: Boolean = false;
    @Input() public loadMoreEmitter = new EventEmitter();

    public loadMore() {
        this.loadMoreEmitter.emit(true);
    }
}
