import { Component, OnInit } from '@angular/core';
import { RevenuePerSalesRepComponent } from '../shared/revenue-per-sales-rep/revenue-per-sales-rep.component';
import { IDateRange } from '../shared/revenue-per-sales-rep/revenue-per-sales-reps.interface';

@Component({
  standalone: true,
  imports: [RevenuePerSalesRepComponent],
  selector: 'app-dummy-dashboard',
  templateUrl: './dummy-dashboard.component.html',
  styleUrls: ['./dummy-dashboard.component.css']
})
export class DummyDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  } 
  month = IDateRange.THIS_MONTH
  quarter = IDateRange.THIS_QUARTER
  year = IDateRange.THIS_YEAR

}
