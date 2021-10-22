import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingBgComponent } from './loading-bg.component';

describe('LoadingBgComponent', () => {
  let component: LoadingBgComponent;
  let fixture: ComponentFixture<LoadingBgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingBgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingBgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
