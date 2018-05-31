import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxYii2RestComponent } from './ngx-yii2-rest.component';

describe('NgxYii2RestComponent', () => {
  let component: NgxYii2RestComponent;
  let fixture: ComponentFixture<NgxYii2RestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxYii2RestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxYii2RestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
