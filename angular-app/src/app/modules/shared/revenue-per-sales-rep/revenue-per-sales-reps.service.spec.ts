import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RevenuePerSalesRepsService } from './revenue-per-sales-reps.service';

describe('Service: RevenuePerSalesReps', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RevenuePerSalesRepsService, provideHttpClient()]
    });
  });

  it('should create', () => {
    const service = TestBed.inject(RevenuePerSalesRepsService);
    expect(service).toBeTruthy();
  });
});
