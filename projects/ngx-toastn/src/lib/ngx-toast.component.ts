// Copyright (C) 2016-2017 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg/ng2-toasty

import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ToastData } from './ngx-toastn.service';

/**
 * A Toast component shows message with title and close button.
 */
@Component({
  selector: 'ngx-toast',
  templateUrl: 'ngx-toast.component.html'
})
export class NgxToastComponent {

  @Input() toast: ToastData;
  @Output('closeToast') closeToastEvent = new EventEmitter();

  /**
   * Event handler invokes when user clicks on close button.
   * This method emit new event into ToastyContainer to close it.
   */
  close($event: any) {
    $event.preventDefault();
    this.closeToastEvent.next(this.toast);
  }
}
