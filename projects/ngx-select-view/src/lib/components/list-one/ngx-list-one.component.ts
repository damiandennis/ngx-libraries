import {
    Component,
    Input,
    ViewChild,
    ElementRef,
    forwardRef, OnChanges, SimpleChanges
} from "@angular/core";
import {SelectAbstract} from "../../select.abstract";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: "ngx-list-one",
    templateUrl: "ngx-list-one.component.html",
    styleUrls: ["ngx-list-one.component.css"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NgxListOneComponent),
            multi: true
        }
    ]
})
export class NgxListOneComponent extends SelectAbstract implements ControlValueAccessor, OnChanges {

    public dropPosition = "below";

    @ViewChild("listRef", {static: false}) public listRef: ElementRef;
    @ViewChild("listDisplayRef", {static: false}) public listDisplayRef: ElementRef;
    public propagateChange = (_: any) => {};

    @Input() public options: Array<any> = [];
    @Input() public keyId = "key";
    @Input() public valueId = "value";
    @Input() public hasSearch = true;
    @Input() public placeholder = "";
    @Input() public searchTerm = "";
    @Input() public isBlock = true;
    public loading = true;
    public value: any;

    /**
     * Updates the value from the search.
     *
     * @param value
     */
    public updateValue(value: any) {
        this.value = value;
        this.setTextByKey();
        this.propagateChange(value);
    }

    /**
     * Finds the text for the specified key.
     */
    public setTextByKey() {
        if (this.options && this.value) {
            let index = this.options.findIndex((option) => option[this.keyId] === this.value);
            if (index !== -1) {
                this.valueText = this.options[index][this.valueId];
            }
        } else {
            this.valueText = '';
        }
    }

    /**
     * @inheritDoc
     */
    public writeValue(obj: any): void {

        if (obj !== undefined) {
            this.value = obj;
            this.setTextByKey();
        }
        this.loading = false;

    }

    /**
     * @inheritDoc
     */
    public registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    /**
     * @inheritDoc
     */
    public registerOnTouched(fn: any): void {}

    /**
     * @inheritDoc
     */
    public ngOnChanges(changes: SimpleChanges): void {
        this.setTextByKey();
    }

}
