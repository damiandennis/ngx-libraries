import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseModel, EndPointService } from 'projects/ngx-rest-auth/src/public_api';
import { BehaviorSubject } from 'rxjs';

export class UserModel extends BaseModel {}

@Injectable({
  providedIn: 'root'
})
export class UserService extends EndPointService {

  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  public primaryKey(): string {
    return 'id';
  }
  public initModel(data: any): BaseModel {
    return new UserModel();
  }
  public endPointUrl(): string {
    return 'dummy/test';
  }

  public fetchAll(): any {
    return new BehaviorSubject({
      meta: {},
      payload: [
        {
          firstName: 'Damian'
        }
      ]
    });
  }
  
}
