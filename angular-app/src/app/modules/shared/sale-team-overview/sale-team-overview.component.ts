import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime, finalize, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { IDateRange } from '../revenue-per-sales-rep/revenue-per-sales-reps.interface';
import { IOverview } from './sale-team-overview.interface';
import { SaleTeamOverviewService } from './sale-team-overview.service';
import { SaleTeamInfoComponent, MetricValueType } from '../sale-team-info/sale-team-info.component';

export enum RenderState {
  LOADING = 'loading',
  ERROR = 'error',
  LOADED = 'loaded',
  EMPTY = 'empty',
}

export interface IMetricCard {
  key: keyof IOverview;
  label: string;
  valueType: MetricValueType;
}

@Component({
  standalone: true,
  selector: 'app-sale-team-overview',
  imports: [CommonModule, SaleTeamInfoComponent],
  providers: [SaleTeamOverviewService],
  templateUrl: './sale-team-overview.component.html',
  styleUrls: ['./sale-team-overview.component.css'],
})
export class SaleTeamOverviewComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() dateRange: IDateRange | null = null;

  cdr = inject(ChangeDetectorRef);
  saleTeamOverviewService = inject(SaleTeamOverviewService);

  renderState: RenderState = RenderState.LOADING;
  errorMessage = '';
  overview: IOverview | null = null;

  readonly metricCards: IMetricCard[] = [
    { key: 'avg_revenue', label: 'Average Revenue per Sales Rep', valueType: 'currency' },
    { key: 'closed_deals', label: 'Closed Deals', valueType: 'number' },
    { key: 'quota_attainment', label: 'Quota Attainment', valueType: 'percent' },
    { key: 'win_rate', label: 'Win Rate', valueType: 'percent' },
  ];

  readonly errorMap: Record<string, string> = {
    '500': 'Failed to load data. Please try again.',
    '404': 'Data not found.',
  };

  loadTrigger$ = new Subject<IDateRange | null>();
  destroy$$ = new Subject<void>();

  ngOnInit(): void {
    this.prepareTrigger();
  }

  ngAfterViewInit(): void {
    this.loadTrigger$.next(this.dateRange);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dateRange'] && !changes['dateRange'].firstChange) {
      this.loadTrigger$.next(this.dateRange);
    }
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }

  onReload(): void {
    this.loadTrigger$.next(this.dateRange);
  }

  changeRenderState(state: RenderState, message = ''): void {
    this.renderState = state;
    this.errorMessage = message;
    this.cdr.markForCheck();
  }

  prepareTrigger(): void {
    this.loadTrigger$
      .pipe(
        tap(() => {
          this.errorMessage = '';
          this.changeRenderState(RenderState.LOADING);
        }),
        debounceTime(300),
        switchMap((dateRange) => this.saleTeamOverviewService.getOverview(dateRange)),
        takeUntil(this.destroy$$),
        finalize(() => { })
      )
      .subscribe({
        next: (res) => {
          this.overview = res.overview;
          this.changeRenderState(RenderState.LOADED);
        },
        error: (err) => {
          console.error('Error fetching overview data:', err);
          const errorMessage = this.errorMap[err.status] || 'An unexpected error occurred.';
          this.changeRenderState(RenderState.ERROR, errorMessage);
        },
      });
  }
}
