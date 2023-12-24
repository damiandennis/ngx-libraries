import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseModel, EndPointService } from 'projects/ngx-rest-auth/src/public_api';

export class SubscriptionModel extends BaseModel { }

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService extends EndPointService {

  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  public primaryKey(): string {
    return 'id';
  }
  public initModel(data: any): BaseModel {
    return new SubscriptionModel(data);
  }
  public endPointUrl(): string {
    return '/v1/users/subscriptions';
  }
  
}
