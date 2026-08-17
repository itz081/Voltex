import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchNotificationComponent } from './watch-notification.component';

describe('WatchNotificationComponent', () => {
  let component: WatchNotificationComponent;
  let fixture: ComponentFixture<WatchNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatchNotificationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
