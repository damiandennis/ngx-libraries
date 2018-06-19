import {Directive, ElementRef, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Directive({
  // tslint:disable-next-line directive-selector
  selector: '[ngx-simple-accordion]',
  exportAs: 'accordion'
})
export class NgxSimpleAccordionDirective implements OnInit {

    static elements: {[key: string]: Array<ElementRef>} = {};
    static channels: {[key: string]: EventEmitter<any>} = {};
    @Input('accordion') public name: string;
    protected isShown = false;
    protected areAnyShown = false;
    @Output() public onInit = new EventEmitter();

    constructor(public elementRef: ElementRef) {}

    /**
     * @inheritDoc
     */
    public ngOnInit() {

        if (this.name === undefined) {
            console.error('accordion directive must be assigned a name.');
            return;
        }
        if (NgxSimpleAccordionDirective.channels[this.name] === undefined) {
            NgxSimpleAccordionDirective.channels[this.name] = new EventEmitter<any>();
        }
        NgxSimpleAccordionDirective.channels[this.name].subscribe(
            (value: any) => {
                this.isShown = value !== false && this.elementRef.nativeElement.isEqualNode(value);
                this.areAnyShown = value !== false;
            }
        );
        this.onInit.emit(true);
    }

    /**
     * When item is closed.
     *
     * @param event
     */
    public close(event: Event = null) {
        if (event) {
            event.preventDefault();
        }
        NgxSimpleAccordionDirective.channels[this.name].emit(false);
    }

    /**
     * When item is opened.
     *
     * @param event
     */
    public open(event: Event = null) {
        if (event) {
            event.preventDefault();
        }
        NgxSimpleAccordionDirective.channels[this.name].emit(this.elementRef.nativeElement);
    }

    /**
     * Toggles open close.
     *
     * @param event
     */
    public toggle(event: Event = null) {
        this.isShown ? this.close(event) : this.open(event);
    }


}
