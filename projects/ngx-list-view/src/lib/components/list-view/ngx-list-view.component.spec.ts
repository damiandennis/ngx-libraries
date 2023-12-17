import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgxListViewComponent } from './ngx-list-view.component';

describe('NgxListViewComponent', () => {
  let component: NgxListViewComponent;
  let fixture: ComponentFixture<NgxListViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
