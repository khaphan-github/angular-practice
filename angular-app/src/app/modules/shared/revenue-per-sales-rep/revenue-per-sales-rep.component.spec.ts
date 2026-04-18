import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { RevenuePerSalesRepComponent } from './revenue-per-sales-rep.component';
import { RevenuePerSalesRepsService } from './revenue-per-sales-reps.service';
import { IDateRange } from './revenue-per-sales-reps.interface';

describe('RevenuePerSalesRepComponent', () => {
  let component: RevenuePerSalesRepComponent;
  let fixture: ComponentFixture<RevenuePerSalesRepComponent>;
  let revenueServiceSpy: {
    getSalesRepRevenue: ReturnType<typeof vi.fn>;
  };

  const successResponse = {
    date_range: IDateRange.THIS_YEAR,
    sales_rep_performance: [
      {
        rep_id: 'rep-1',
        rep_name: 'Alice',
        revenue: 1200,
        deals_closed: 4,
        quota_attainment: 0.8
      }
    ]
  };

  beforeEach(async () => {
    vi.useFakeTimers();

    revenueServiceSpy = {
      getSalesRepRevenue: vi.fn().mockReturnValue(of(successResponse))
    };

    TestBed.configureTestingModule({
      imports: [RevenuePerSalesRepComponent]
    });

    TestBed.overrideComponent(RevenuePerSalesRepComponent, {
      set: {
        providers: [{ provide: RevenuePerSalesRepsService, useValue: revenueServiceSpy }]
      }
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(RevenuePerSalesRepComponent);
    component = fixture.componentInstance;
    component.dateRange = IDateRange.THIS_YEAR;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call api after debounce and render loaded state', () => {
    const renderSpy = vi.spyOn(component, 'renderChart').mockImplementation(() => undefined);

    fixture.detectChanges();

    expect(revenueServiceSpy.getSalesRepRevenue).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    fixture.detectChanges();

    expect(revenueServiceSpy.getSalesRepRevenue).toHaveBeenCalledWith(IDateRange.THIS_YEAR);
    expect(component.renderState).toBe('loaded');
    expect(renderSpy).toHaveBeenCalled();
  });

  it('should reload when onReload is clicked', () => {
    fixture.detectChanges();
    vi.advanceTimersByTime(300);
    vi.clearAllMocks();

    component.onReload();
    vi.advanceTimersByTime(300);
    fixture.detectChanges();

    expect(revenueServiceSpy.getSalesRepRevenue).toHaveBeenCalledTimes(1);
    expect(revenueServiceSpy.getSalesRepRevenue).toHaveBeenCalledWith(IDateRange.THIS_YEAR);
  });

  it('should show mapped error message for 404', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    revenueServiceSpy.getSalesRepRevenue.mockReturnValue(
      throwError(() => ({ status: 404 }))
    );

    fixture.detectChanges();
    vi.advanceTimersByTime(300);
    fixture.detectChanges();

    expect(component.renderState).toBe('error');
    expect(component.errorMessage).toBe('Data not found.');
  });
});
