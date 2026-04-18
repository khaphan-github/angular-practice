import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { RevenuePerSalesRepComponent } from './revenue-per-sales-rep.component';
import { RevenuePerSalesRepsService } from './revenue-per-sales-reps.service';
import { IDateRange } from './revenue-per-sales-reps.interface';
import { vi } from 'vitest';
import { Chart } from 'chart.js';

// Given/When/Then structure:
// Given: the component and its mocked dependencies
// When: the component loads or the mocked API responds
// Then: verify the rendered state and side effects
describe('RevenuePerSalesRepComponent', () => {
  let component: RevenuePerSalesRepComponent;
  let fixture: ComponentFixture<RevenuePerSalesRepComponent>;
  let revenueServiceSpy: {
    getSalesRepRevenue: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    // Create mock services.
    revenueServiceSpy = {
      getSalesRepRevenue: vi.fn()
    };

    TestBed.configureTestingModule({
      imports: [RevenuePerSalesRepComponent]
    });

    TestBed.overrideComponent(RevenuePerSalesRepComponent, {
      set: {
        providers: [
          { provide: RevenuePerSalesRepsService, useValue: revenueServiceSpy }
        ]
      }
    });

    await TestBed.compileComponents();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenuePerSalesRepComponent);
    component = fixture.componentInstance;
  });

  it('given the component is initialized, when Angular creates it, then the instance should exist', () => {
    const response$ = new Subject<{
      date_range: string;
      sales_rep_performance: any[];
    }>();
    revenueServiceSpy.getSalesRepRevenue.mockReturnValue(response$.asObservable());

    vi.spyOn(component, 'renderChart').mockImplementation(() => undefined);
    fixture.detectChanges();

    expect(component).toBeTruthy();

    response$.complete();
  });

  it('given the api request is still pending, when the component loads, then it should show the loading template', () => {
    const response$ = new Subject<{
      date_range: string;
      sales_rep_performance: any[];
    }>();
    revenueServiceSpy.getSalesRepRevenue.mockReturnValue(response$.asObservable());

    vi.spyOn(component, 'renderChart').mockImplementation(() => undefined);
    fixture.detectChanges();
    expect(component.renderState).toBe('loading');
    expect(fixture.nativeElement.textContent).toContain('Đang tải dữ liệu');

    response$.next({
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
    });
    response$.complete();
    fixture.detectChanges();

    expect(component.renderState).toBe('loaded');
    expect(fixture.nativeElement.textContent).not.toContain('Đang tải dữ liệu');
  });

  it('given the api returns revenue data, when the component loads, then it should fetch data and render the chart', () => {
    const response$ = new Subject<{
      date_range: string;
      sales_rep_performance: any[];
    }>();
    revenueServiceSpy.getSalesRepRevenue.mockReturnValue(response$.asObservable());

    const renderSpy = vi.spyOn(component, 'renderChart').mockImplementation(() => undefined);
    fixture.detectChanges();

    response$.next({
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
    });
    response$.complete();
    fixture.detectChanges();

    expect(revenueServiceSpy.getSalesRepRevenue).toHaveBeenCalledWith(IDateRange.THIS_YEAR);
    expect(renderSpy).toHaveBeenCalled();
    expect(component.renderState).toBe('loaded');
  });

  it('given the api request fails, when the component loads, then it should show the error message', () => {
    const response$ = new Subject<{
      date_range: string;
      sales_rep_performance: any[];
    }>();
    revenueServiceSpy.getSalesRepRevenue.mockReturnValue(response$.asObservable());
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    fixture.detectChanges();
    response$.error(new Error('Network error'));
    fixture.detectChanges();

    expect(component.renderState).toBe('error');
    expect(component.errorMessage).toBe('Failed to load data. Please try again.');
    expect(fixture.nativeElement.textContent).toContain('Failed to load data. Please try again.');
  });

  it('given the api request fails, when the compoent loads, thenit should render error emssage', () => {
    const resonse$ = new Subject<{
      date_range: string;
      sales_rep_performance: any[];
    }>();

    revenueServiceSpy.getSalesRepRevenue.mockReturnValue(resonse$.asObservable());
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    fixture.detectChanges();
    resonse$.error(new Error('Rate Limit'))
    fixture.detectChanges();

    expect(component.renderState).toBe('error');
    expect(component.errorMessage).toBe('Failed to load data. Please try again.');
    expect(fixture.nativeElement.textContent).toContain('Failed to load data. Please try again.');
  })
});
