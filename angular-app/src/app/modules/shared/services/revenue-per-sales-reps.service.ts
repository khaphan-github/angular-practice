import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IDateRange, IRevenuePerSalesRep } from '../revenue-per-sales-rep/revenue-per-sales-reps.interface';
import { Observable } from 'rxjs';

@Injectable()
export class RevenuePerSalesRepsService {
  httpClient = inject(HttpClient);
  constructor() { }

  /**
   * Get revenue per sales representative data for a given date range
   * @param dateRange - The date range for which to fetch the data (e.g., 'this_quarter', 'this_month', 'this_year')
   * @param dateRange 
   * @returns 
   */
  getSalesRepRevenue(dateRange: IDateRange | null): Observable<{
    date_range: string,
    sales_rep_performance: IRevenuePerSalesRep[]
  }> {
    return this.httpClient.get<
      { date_range: string, sales_rep_performance: IRevenuePerSalesRep[] }
    >(`http://localhost:3000/sales-rep-performance?date_range=${dateRange}`);
  }
}
