import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { IDateRange, IRevenuePerSalesRep } from './revenue-per-sales-reps.interface';
import { RevenuePerSalesRepsService } from './revenue-per-sales-reps.service';
import { CommonModule } from '@angular/common';
import { map, Subject, takeUntil } from 'rxjs';
import { Chart } from 'chart.js/auto';
/**
 * Main functional requirements
 * - spinner when load
 * - show chart
 * - show ui when error retry butotn
 */
@Component({
  standalone: true,
  selector: 'app-revenue-per-sales-rep',
  imports: [
    CommonModule,
  ],
  providers: [RevenuePerSalesRepsService],
  templateUrl: './revenue-per-sales-rep.component.html',
  styleUrls: ['./revenue-per-sales-rep.component.css']
})
export class RevenuePerSalesRepComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() dateRange: IDateRange = IDateRange.THIS_YEAR;
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  revenuePerSalesRepsService = inject(RevenuePerSalesRepsService);
  destroy$$ = new Subject<void>();
  initialLoadTimeout?: ReturnType<typeof setTimeout>;
  // Behavior
  chart?: Chart;
  isLoading: boolean = false;
  errorMessage = '';

  constructor() { }

  private _transformToChartData(data: IRevenuePerSalesRep[]) {
    const labels: Array<string> = []
    const dataValues: Array<number> = []
    const datasets: Array<{ label: string; data: number[] }> = [{
      label: 'Revenue',
      data: []
    }];
    if (data.length === 0) {
      return { labels, datasets };
    }
    for (const item of data) {
      labels.push(item.rep_name);
      dataValues.push(item.revenue);
    }
    datasets[0].data = dataValues;
    return { labels, datasets };
  }

  ngAfterViewInit() {
    this.loadChart();
  }

  loadChart() {
    this.revenuePerSalesRepsService.getSalesRepRevenue(this.dateRange).pipe(
      map(res => res.sales_rep_performance),
      map(data => this._transformToChartData(data)),
      takeUntil(this.destroy$$)
    ).subscribe({
      next: (chartData) => {
        this.renderChart(chartData);
      },
      error: (err) => {
        console.error('Error fetching revenue per sales rep data:', err);
        this.errorMessage = 'Failed to load data. Please try again.';
      }
    });
  }
  ngOnInit() {
  }

  renderChart(chartData: any) {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    if (this.chart) {
      this.chart.data.labels = chartData.labels;
      this.chart.data.datasets = chartData.datasets;
      this.chart.update();
      return;
    }
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: chartData.labels,
        datasets: chartData.datasets
      },
      options: {
        responsive: true,
      }
    });
  }

  destroyChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
    this.isLoading = false;
    this.errorMessage = '';
  }

  ngOnDestroy(): void {
    if (this.initialLoadTimeout) {
      clearTimeout(this.initialLoadTimeout);
    }
    this.destroy$$.next();
    this.destroy$$.complete();
    this.destroyChart();
  }

}
