import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NerFilterComponent } from './ner-filter.component';

describe('NerFilterComponent', () => {
  let component: NerFilterComponent;
  let fixture: ComponentFixture<NerFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NerFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NerFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
