import { Component } from '@angular/core';
import { UserPageService } from './services/user-page.service';
import { UserMoreService } from './services/user-more.service';
import 'bootstrap';
import { SubscriptionService } from './services/subscription.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    public userPageService: UserPageService, 
    public userMoreService: UserMoreService,
    public subscriptionService: SubscriptionService) {
    this.userPageService.setParam('perPage', 5);
    this.userMoreService.setParam('perPage', 5);
  }
}
