import {
    Component,
    ViewChild,
    Input,
    OnInit,
    AfterViewInit,
    HostListener,
    Output,
    EventEmitter,
    OnChanges,
    ElementRef
} from "@angular/core";
import {KEY} from "../../utils/key.map";
import cloneObject from "../../utils/clone.object";
import isPrimative from "../../utils/is.primative";
import {WindowRefService} from "../../services/windowRefService";
import {debounceTime} from 'rxjs/operators';

@Component({
    selector: "ngx-droplist",
    templateUrl: "ngx-droplist.component.html",
    styleUrls: ["ngx-droplist.component.css"]
})
export class NgxDroplistComponent implements OnInit, AfterViewInit, OnChanges {

    @ViewChild("listDropDownRef") public listDropDownRef: ElementRef;
    @ViewChild("listSearchRef") public listSearchRef: ElementRef;
    @ViewChild("searchControl") public searchControl: any;

    public id: any;
    public window: Window;
    public document: Document;
    public displayPosition: any = {};
    public activeItem = 0;
    public filteredOptions: Array<any> = [];
    public searchTerm = "";
    public isInternalHidden = false;

    @Input() public hasSearch = true;
    @Input() public placeholder = "";
    @Input() public options: Array<any>;
    @Input() public value: any;
    @Input() public keyId = "key";
    @Input() public valueId = "value";
    @Input() public isSearchHidden: boolean = true;
    @Input() public displayRef: HTMLElement;
    @Input() public dropPosition = "below";

    @Output() public valueChange = new EventEmitter();
    @Output() public isSearchHiddenChange = new EventEmitter();
    @Output() public dropPositionChange = new EventEmitter();

    constructor(public winRef: WindowRefService) {
        this.window = winRef.nativeWindow;
        this.document = this.window.document;
    }

    /**
     * @inheritDoc
     */
    public ngOnInit() {

        if (this.value) {
            // For primatives we set the index.
            if (isPrimative(this.value)) {
                this.filteredOptions = cloneObject(this.options);
                this.activeItem = this.options.findIndex((option) => option[this.keyId] === this.value);
            }
            // For arrays we filter what is not selected.
            else {
                this.filteredOptions = this.multiFilteredOption();
            }

        } else {
            this.filteredOptions = cloneObject(this.options);
        }
    }

    /**
     * If its a multiple selection.
     *
     * @returns any
     */
    public multiFilteredOption() {
        if (this.options) {
            return cloneObject(this.options)
                .filter((option: any) => {
                    return isPrimative(this.value)
                        ? true
                        : this.value.indexOf(option[this.keyId]) === -1;
                });
        } else {
            return [];
        }
    }

    /**
     * @inheritDoc
     */
    public ngOnChanges(changes: any) {

        if (changes["options"]) {
            this.filteredOptions = cloneObject(this.options);
        }
        if (changes["isSearchHidden"]) {

            // Reset search if closing.
            if (changes["isSearchHidden"].previousValue === true &&
                changes["isSearchHidden"].currentValue === false) {

                // Make async to prevent internal expression has changed error since we are only checking on searchHidden check.
                setTimeout(() => {
                    if (this.value) {
                        this.resetSearch();
                        this.filteredOptions = this.multiFilteredOption();
                        this.openListSelector(this.displayRef);
                    }
                }, 0);

            }
        }
    }

    /**
     * @inheritDoc
     */
    public ngAfterViewInit() {

        this.searchControl
            .valueChanges
            .pipe(debounceTime(10))
            .subscribe(
                () => {
                    this.filterOptions();

                    setTimeout(() => {
                        // Height needs recalculation on search if above.
                        if (this.dropPosition === "above") {
                            let top = this.listDropDownRef.nativeElement.offsetHeight * -1;
                            this.displayPosition["top"] = top + "px";
                        }
                    }, 100);
                }
            );

    }

    /**
     * Updates the drop position.
     * @param value
     */
    public updateDropPosition(value: any) {
        this.dropPosition = value;
        this.dropPositionChange.emit(value);
    }

    /**
     * Filters the search response.
     *
     * @returns any
     */
    public filterOptions() {
        if (this.searchTerm.length > 0) {
            this.filteredOptions = this.multiFilteredOption()
                .filter((option: any) => {
                    return option[this.valueId]
                            .toLowerCase()
                            .indexOf(this.searchTerm.toLowerCase()) !== -1;
                })
                .map((option: any) => {
                    let response: any = {};
                    response[this.keyId] = option[this.keyId];
                    let start = option[this.valueId]
                        .toLowerCase()
                        .indexOf(this.searchTerm.toLowerCase());
                    let underlined = option[this.valueId].split("");
                    let replacement = underlined.slice(start, start + this.searchTerm.length).join("");
                    underlined.splice(
                        start,
                        this.searchTerm.length,
                        `<span class="select2-match">${replacement}</span>`
                    );
                    response[this.valueId] = underlined.join("");
                    response["original"] = option[this.valueId];
                    return response;
                });

            // Reset active item.
            this.activeItem = 0;
        } else {
            this.filteredOptions = this.multiFilteredOption();
        }
    }

    /**
     * When item is scrolled.
     *
     * @param e
     */
    public scrollOptions(e: any) {
        // filter 229 keyCodes (input method editor is processing key input)
        if (229 === e.keyCode) return;

        if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
            // prevent the page from scrolling
            this.killEvent(e);
            return;
        }

        switch (e.which) {
            case KEY.UP:
                if (this.activeItem - 1 > -1) {
                    this.activeItem--;
                }
                this.killEvent(e);
                return;
            case KEY.DOWN:
                if (this.options[this.activeItem + 1]) {
                    this.activeItem++;
                }
                this.killEvent(e);
                return;
            case KEY.ENTER:
                this.selectOption(this.filteredOptions[this.activeItem]);
                this.killEvent(e);
                return;
            case KEY.TAB:
                this.selectOption(this.filteredOptions[this.activeItem]);
                this.closeSearch();
                return;
            case KEY.ESC:
                this.closeSearch();
                this.killEvent(e);
                return;
        }
    }

    /**
     * Selects the option.
     *
     * @param item
     * @param event
     */
    public selectOption(item: any, event: Event = null) {

        this.valueChange.emit(item[this.keyId]);

        this.closeSearch();
        if (event) {
            this.killEvent(event);
        }
    }

    /**
     * Closes the search container.
     */
    public closeSearch() {
        this.isSearchHiddenChange.emit(true);
    }

    /**
     * Opens the search container.
     */
    public openSearch() {
        this.isSearchHiddenChange.emit(false);
    }

    /**
     * Resets the search container.
     */
    public resetSearch() {
        this.searchTerm = "";
        this.activeItem = 0;
        this.dropPosition = "below";
    }

    /**
     * Opens the search container at the correct position.
     */
    public openListSelector(parent: HTMLElement) {

        this.isInternalHidden = false;

        let rect = parent.getBoundingClientRect();
        let offset = {
            top: rect.top + this.document.body.scrollTop,
            left: rect.left + this.document.body.scrollLeft
        };

        let height = parent.offsetHeight;
        let dropHeight = this.listDropDownRef.nativeElement.offsetHeight;
        let windowHeight = this.window.innerHeight;

        let dropTop = offset.top + height;
        let viewportBottom = this.document.body.scrollTop + windowHeight;
        let enoughRoomBelow = dropTop + dropHeight <= viewportBottom;

        let enoughRoomAbove = (offset.top - dropHeight) >= this.document.body.scrollTop;
        let aboveNow = this.dropPosition === "above";
        let above = false;
        let changeDirection = false;

        if (aboveNow) {
            above = true;
            if (!enoughRoomAbove && enoughRoomBelow) {
                changeDirection = true;
                above = false;
            }
        } else {
            above = false;
            if (!enoughRoomBelow && enoughRoomAbove) {
                changeDirection = true;
                above = true;
            }
        }

        // if we are changing direction we need to get positions when dropdown is hidden;
        if (changeDirection) {

            this.isInternalHidden = true;

            height = parent.offsetHeight;
            dropHeight = this.listDropDownRef.nativeElement.offsetHeight;

            this.isInternalHidden = false;
        }

        this.updateDropPosition(above ? "above" : "below");

        this.displayPosition = {
            top: (above ? dropHeight * -1 : height) + "px",
            bottom: "auto"
        };

        // added delay to give time for display to be visible.
        setTimeout(() => {
            this.listSearchRef.nativeElement.focus();
        }, 100);
    }

    /**
     * Kills the current event.
     *
     * @param event
     */
    public killEvent(event: Event) {
        event.preventDefault();
        event.stopPropagation();
    }

    @HostListener("window:resize")
    public onResize() {
        // Refresh position on resize.
        if (!this.isSearchHidden) {
            this.openListSelector(this.displayRef);
        }
    }

    @HostListener("window:scroll")
    public onScroll() {
        // Refresh position on resize.
        if (!this.isSearchHidden) {
            this.openListSelector(this.displayRef);
        }
    }

}
