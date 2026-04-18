import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ClosedDealsQuotaAttainmentComponent } from './closed-deals-quota-attainment.component';

describe('ClosedDealsQuotaAttainmentComponent', () => {
  let component: ClosedDealsQuotaAttainmentComponent;
  let fixture: ComponentFixture<ClosedDealsQuotaAttainmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClosedDealsQuotaAttainmentComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ClosedDealsQuotaAttainmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
