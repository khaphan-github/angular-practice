import { Component, OnInit } from '@angular/core';
import { RevenuePerSalesRepComponent } from '../shared/revenue-per-sales-rep/revenue-per-sales-rep.component';
import { IDateRange } from '../shared/revenue-per-sales-rep/revenue-per-sales-reps.interface';
import { DropdownRangeComponent } from '../shared/dropdown-range/dropdown-range.component';

@Component({
  standalone: true,
  imports: [RevenuePerSalesRepComponent, DropdownRangeComponent],
  selector: 'app-dummy-dashboard',
  templateUrl: './dummy-dashboard.component.html',
  styleUrls: ['./dummy-dashboard.component.css']
})
export class DummyDashboardComponent implements OnInit {
  constructor() { }
  ngOnInit() {
  }
  options = [
    { label: 'This Month', value: IDateRange.THIS_MONTH },
    { label: 'This Quarter', value: IDateRange.THIS_QUARTER },
    { label: 'This Year', value: IDateRange.THIS_YEAR }
  ]
  selectedDateRange = this.options[0].value; // Default to first option
  onOptionSelected(event: any) {
    this.selectedDateRange = event;
  }
}
