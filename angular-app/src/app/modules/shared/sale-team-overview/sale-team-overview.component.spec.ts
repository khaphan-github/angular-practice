import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SaleTeamOverviewComponent } from './sale-team-overview.component';

describe('SaleTeamOverviewComponent', () => {
  let component: SaleTeamOverviewComponent;
  let fixture: ComponentFixture<SaleTeamOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleTeamOverviewComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SaleTeamOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
