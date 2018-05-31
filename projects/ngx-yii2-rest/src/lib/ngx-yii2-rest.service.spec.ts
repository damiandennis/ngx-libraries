import { TestBed, inject } from '@angular/core/testing';

import { NgxYii2RestService } from './ngx-yii2-rest.service';

describe('NgxYii2RestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxYii2RestService]
    });
  });

  it('should be created', inject([NgxYii2RestService], (service: NgxYii2RestService) => {
    expect(service).toBeTruthy();
  }));
});
