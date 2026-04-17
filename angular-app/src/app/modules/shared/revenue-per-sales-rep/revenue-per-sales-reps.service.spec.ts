/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RevenuePerSalesRepsService } from './revenue-per-sales-reps.service';

describe('Service: RevenuePerSalesReps', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RevenuePerSalesRepsService]
    });
  });

  it('should ...', inject([RevenuePerSalesRepsService], (service: RevenuePerSalesRepsService) => {
    expect(service).toBeTruthy();
  }));
});
