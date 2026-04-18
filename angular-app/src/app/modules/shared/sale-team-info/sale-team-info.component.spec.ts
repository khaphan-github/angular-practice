import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleTeamInfoComponent } from './sale-team-info.component';

describe('SaleTeamInfoComponent', () => {
  let component: SaleTeamInfoComponent;
  let fixture: ComponentFixture<SaleTeamInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleTeamInfoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SaleTeamInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
