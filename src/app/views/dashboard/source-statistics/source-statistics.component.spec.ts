import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceStatisticsComponent } from './source-statistics.component';

describe('SourceStatisticsComponent', () => {
  let component: SourceStatisticsComponent;
  let fixture: ComponentFixture<SourceStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
