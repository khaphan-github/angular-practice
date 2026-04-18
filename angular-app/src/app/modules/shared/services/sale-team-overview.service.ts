import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDateRange } from '../revenue-per-sales-rep/revenue-per-sales-reps.interface';
import { IOverviewResponse } from '../sale-team-overview/sale-team-overview.interface';

@Injectable()
export class SaleTeamOverviewService {
  httpClient = inject(HttpClient);

  getOverview(dateRange: IDateRange | null): Observable<IOverviewResponse> {
    return this.httpClient.get<IOverviewResponse>(
      `http://localhost:3000/overview?date_range=${dateRange}`
    );
  }
}
