import {
    Component,
    Input,
    ViewChild,
    ElementRef,
    forwardRef
} from "@angular/core";
import {SelectAbstract} from "../../select.abstract";
import isPrimative from "../../utils/is.primative";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: "ngx-list-many",
    templateUrl: "ngx-list-many.component.html",
    styleUrls: ["ngx-list-many.component.css"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NgxListManyComponent),
            multi: true
        }
    ]
})
export class NgxListManyComponent extends SelectAbstract implements ControlValueAccessor {

    public loading = true;
    public keyList: Array<any> = [];
    public valueList: Array<any> = [];
    public dropPosition = "below";
    propagateChange = (_: any) => {};

    @ViewChild("listRef", {static: false}) public listRef: ElementRef;
    @ViewChild("listDisplayRef", {static: false}) public listDisplayRef: ElementRef;

    @Input() public keyId = "key";
    @Input() public valueId = "value";
    @Input() public hasSearch = true;
    @Input() public placeholder = "";
    @Input() public searchTerm = "";
    @Input() public options: Array<any> = [];
    public value: any;

    /**
     * Finds the text for the specified key.
     */
    public setValueListByKey() {
        if (this.options && this.value) {
            this.keyList = this.value
                .filter((value: any) => this.options.findIndex((option) => option[this.keyId] === value) !== -1)
                .map((value: any) => {
                    return this.options.find((option) => option[this.keyId] === value)[this.keyId];
                });
            this.valueList = this.value
                .filter((value: any) => this.options.findIndex((option) => option[this.keyId] === value) !== -1)
                .map((value: any) => {
                    return this.options.find((option) => option[this.keyId] === value)[this.valueId];
                });
        }
    }


    /**
     * When value is updates.
     *
     * @param event
     */
    public updateValue(event: Event) {
        this.value.push(event);
        this.setValueListByKey();
        this.propagateChange(this.value);
    }

    /**
     * Removes an item from the list.
     *
     * @param index
     * @param event
     */
    public removeItem(index: any, event: Event) {
        event.stopPropagation();
        this.value = this.value.filter(
            (option: any, i: any) => {
                return i !== index;
            }
        );
        this.setValueListByKey();
        this.propagateChange(this.value);
    }

    /**
     * @inheritDoc
     */
    public writeValue(obj: any): void {

        // Make sure value is not a primitive.
        if (isPrimative(obj)) {
            return;
        }

        if (obj !== undefined) {
            this.value = obj;
            this.setValueListByKey();
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

}
