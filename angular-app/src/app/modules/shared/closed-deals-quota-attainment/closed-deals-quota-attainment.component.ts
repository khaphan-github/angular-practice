import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { debounceTime, finalize, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { IDateRange, IRevenuePerSalesRep } from '../revenue-per-sales-rep/revenue-per-sales-reps.interface';
import { RevenuePerSalesRepsService } from '../revenue-per-sales-rep/revenue-per-sales-reps.service';
import { RenderState } from '../interfaces/component-render-state.interface';

export interface IChartView {
  title: string;
  description: string;
}

interface IDealsQuotaChartData {
  labels: string[];
  fullNames: string[];
  dealsClosed: number[];
  quotaAttainment: number[];
}

@Component({
  standalone: true,
  selector: 'app-closed-deals-quota-attainment',
  imports: [CommonModule],
  providers: [RevenuePerSalesRepsService],
  templateUrl: './closed-deals-quota-attainment.component.html',
  styleUrls: ['./closed-deals-quota-attainment.component.css'],
})
export class ClosedDealsQuotaAttainmentComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() dateRange: IDateRange | null = null;
  @Input() view: IChartView = {
    title: 'Number of Closed Deals and Quota Attainment',
    description: 'Column (left): Closed deals. Line (right): Quota attainment.',
  };
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  cdr = inject(ChangeDetectorRef);
  revenuePerSalesRepsService = inject(RevenuePerSalesRepsService);

  chart?: Chart;
  renderState: RenderState = RenderState.LOADING;
  errorMessage = '';

  loadTrigger$ = new Subject<IDateRange | null>();
  destroy$$ = new Subject<void>();
  errorMap: Record<string, string> = {
    '500': 'Failed to load data. Please try again.',
    '404': 'Data not found.',
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dateRange'] && !changes['dateRange'].firstChange) {
      this.loadTrigger$.next(this.dateRange);
    }
  }

  ngOnInit(): void {
    this.prepareTrigger();
  }

  ngAfterViewInit(): void {
    this.loadTrigger$.next(this.dateRange);
  }

  ngOnDestroy(): void {
    this.destroyChart();
    this.destroy$$.next();
    this.destroy$$.complete();
  }

  onReload(): void {
    this.loadTrigger$.next(this.dateRange);
  }

  changeRenderState(renderState: RenderState, message?: string): void {
    this.renderState = renderState;
    this.errorMessage = message || '';
    this.cdr.markForCheck();
  }

  private transformToChartData(data: IRevenuePerSalesRep[]): IDealsQuotaChartData {
    if (data.length === 0) {
      return {
        labels: [],
        fullNames: [],
        dealsClosed: [],
        quotaAttainment: [],
      };
    }

    return {
      labels: data.map((_, index) => `Rep ${index + 1}`),
      fullNames: data.map((item) => item.rep_name),
      dealsClosed: data.map((item) => item.deals_closed),
      quotaAttainment: data.map((item) => Number((item.quota_attainment * 100).toFixed(1))),
    };
  }

  renderChart(chartData: IDealsQuotaChartData): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    const minQuota = Math.max(0, Math.floor(Math.min(...chartData.quotaAttainment) - 5));
    const maxQuota = Math.min(120, Math.ceil(Math.max(...chartData.quotaAttainment) + 5));

    if (this.chart) {
      this.chart.data.labels = chartData.labels;
      this.chart.data.datasets = [
        {
          type: 'bar',
          label: 'Number of Closed Deals',
          data: chartData.dealsClosed,
          yAxisID: 'yDeals',
          backgroundColor: 'rgba(121, 99, 224, 0.85)',
          borderRadius: 2,
          borderSkipped: false,
          barThickness: 24,
        } as any,
        {
          type: 'line',
          label: 'Quota Attainment',
          data: chartData.quotaAttainment,
          yAxisID: 'yQuota',
          borderColor: '#62d2dd',
          backgroundColor: '#62d2dd',
          pointBackgroundColor: '#62d2dd',
          pointBorderColor: '#62d2dd',
          pointRadius: 3,
          tension: 0.3,
        } as any,
      ];
      (this.chart.options.scales as any).yQuota.min = minQuota;
      (this.chart.options.scales as any).yQuota.max = maxQuota;
      this.chart.update();
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            type: 'bar',
            label: 'Number of Closed Deals',
            data: chartData.dealsClosed,
            yAxisID: 'yDeals',
            backgroundColor: 'rgba(121, 99, 224, 0.85)',
            borderRadius: 2,
            borderSkipped: false,
            barThickness: 24,
          } as any,
          {
            type: 'line',
            label: 'Quota Attainment',
            data: chartData.quotaAttainment,
            yAxisID: 'yQuota',
            borderColor: '#62d2dd',
            backgroundColor: '#62d2dd',
            pointBackgroundColor: '#62d2dd',
            pointBorderColor: '#62d2dd',
            pointRadius: 3,
            tension: 0.3,
          } as any,
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Sales Rep',
            },
            grid: {
              display: false,
            },
          },
          yDeals: {
            type: 'linear',
            position: 'left',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Closed Deals',
            },
          },
          yQuota: {
            type: 'linear',
            position: 'right',
            min: minQuota,
            max: maxQuota,
            title: {
              display: true,
              text: 'Quota Attainment',
            },
            ticks: {
              callback: (value: string | number) => `${value}%`,
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              title: (items: Array<{ dataIndex: number }>) => {
                const item = items[0];
                if (!item) {
                  return '';
                }
                return chartData.fullNames[item.dataIndex] || chartData.labels[item.dataIndex] || '';
              },
              label: (context: { dataset: { yAxisID?: string; label?: string }; parsed: { y: number } }) => {
                if (context.dataset.yAxisID === 'yQuota') {
                  return `${context.dataset.label}: ${context.parsed.y}%`;
                }
                return `${context.dataset.label}: ${context.parsed.y}`;
              },
            },
          },
        },
      } as any,
    });
  }

  destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    this.errorMessage = '';
  }

  prepareTrigger(): void {
    this.loadTrigger$
      .pipe(
        tap(() => {
          this.errorMessage = '';
          this.changeRenderState(RenderState.LOADING);
        }),
        debounceTime(300),
        switchMap((dateRange) => this.revenuePerSalesRepsService.getSalesRepRevenue(dateRange)),
        map((res) => res.sales_rep_performance),
        map((data) => this.transformToChartData(data)),
        takeUntil(this.destroy$$),
        finalize(() => { })
      )
      .subscribe({
        next: (chartData) => {
          if (chartData.labels.length === 0) {
            this.changeRenderState(RenderState.EMPTY);
            return;
          }
          this.changeRenderState(RenderState.LOADED);
          this.renderChart(chartData);
        },
        error: (err) => {
          console.error('Error fetching sales rep performance data:', err);
          const errorMessage = this.errorMap[err.status] || 'An unexpected error occurred.';
          this.changeRenderState(RenderState.ERROR, errorMessage);
        },
      });
  }
}
