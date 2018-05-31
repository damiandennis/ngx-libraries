import {Component, ContentChildren, QueryList} from '@angular/core';
import {Input} from '@angular/core';
import {EventEmitter} from '@angular/core';
import {HostBinding} from '@angular/core';
import {NgxListFormResetDirective} from '../../directives/ngx-list-form-reset.directive';

@Component({
    selector: 'ngx-list-preview',
    templateUrl: 'ngx-list-preview.component.html'
})
export class NgxListPreviewComponent {

    public _data: any;
    @HostBinding('class.hidden') hidden = true;

    @Input() public visibleEmitter = new EventEmitter();
    @Input() public dataEmitter = new EventEmitter();
    @ContentChildren(NgxListFormResetDirective) forms: QueryList<NgxListFormResetDirective>;

    /**
     * Closes the list preview.
     */
    public closePreview() {
        this.visibleEmitter.emit(true);
        this.hidden = true;
    }

    /**
     * Gets the data.
     *
     * @returns any
     */
    public get data() {
        return this._data;
    }

    /**
     * Sets the data.
     *
     * @param data
     */
    public set data(data: any) {
        this._data = data;
        this.forms.forEach((resetFormDir: NgxListFormResetDirective) => {
            resetFormDir.form.resetForm(data);
        });
    }

    /**
     * Checks whether the user should be prompted to save changes if form is dirty.
     *
     * @returns boolean
     */
    public shouldPromptReset() {
        const resets = this.forms.map((resetFormDir: NgxListFormResetDirective) => {
            return resetFormDir.reset && resetFormDir.form.dirty;
        });
        return resets.indexOf(true) !== -1;
    }

}
