import {
  Directive, OnChanges, ElementRef, Input, Output, EventEmitter, Renderer2, OnInit
} from '@angular/core';

@Directive({
  // tslint:disable-next-line directive-selector
  selector: 'input[icheck]'
})
export class NgxIcheckDirective implements OnChanges, OnInit {

  @Input('icheck') public isChecked: any;
  @Output() public icheckChange = new EventEmitter<number>(); // This allows two way binding for this directive.
  @Input() public type = 'checkbox';
  @Input() public value: any;
  public parentElement: Element;

  constructor(public element: ElementRef, public renderer: Renderer2) {}

  /**
   * @inheritDoc
   */
  public ngOnInit() {
    this.parentElement = this.renderer.createElement('div');
    const currentParent = this.renderer.parentNode(this.element.nativeElement);
    this.renderer.insertBefore(currentParent, this.parentElement, this.element.nativeElement);
    this.renderer.addClass(this.parentElement, 'icheckbox_square-blue');
    this.renderer.setStyle(this.parentElement, 'position', 'relative');
    this.renderer.setStyle(this.element.nativeElement, 'display', 'none');
    this.renderer.listen(this.parentElement, 'click', (event) => this.toggleCheckbox(event));
  }

  /**
   * Toggles the checkbox.
   *
   * @param event
  */
  public toggleCheckbox(event: Event) {
    event.preventDefault();
    this.isChecked = !this.isChecked;
    this.updateCheckStatus();
  }

  /**
   * @inheritdoc
   */
  public ngOnChanges(changes: any) {
    this.isChecked = this.isChecked || false;
    this.updateCheckStatus(false);
  }

  /**
   * Updates the value
   */
  public updateCheckStatus(emit = true) {
    if (this.isChecked) {
      this.renderer.addClass(this.parentElement, 'checked');
    } else if (this.parentElement) {
      this.renderer.removeClass(this.parentElement, 'checked');
    }
    if (emit) {
      this.icheckChange.emit(+this.isChecked);
    }
  }

  public check() {
    this.isChecked = true;
    this.updateCheckStatus();
  }

  public unCheck() {
    this.isChecked = false;
    this.updateCheckStatus();
  }
}
