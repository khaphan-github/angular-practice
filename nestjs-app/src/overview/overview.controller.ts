import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Overview')
@Controller('overview')
export class OverviewController {
  @Get()
  @ApiOperation({
    summary: 'Get KPI overview cards',
    description:
      'Returns avg revenue, closed deals, quota attainment and win rate compared to the previous period.',
  })
  @ApiQuery({
    name: 'date_range',
    required: false,
    enum: ['this_quarter', 'this_month', 'this_year'],
    description: 'Time range for aggregation',
  })
  @ApiResponse({
    status: 200,
    description: 'KPI overview data returned successfully.',
  })
  getOverview(@Query('date_range') dateRange?: string) {
    return {
      date_range: dateRange ?? 'this_quarter',
      overview: {
        avg_revenue: { current: 85000, previous: 78500, growth_pct: 0.083 },
        closed_deals: { current: 45, previous: 47, growth_pct: -0.042 },
        quota_attainment: { current: 0.88, previous: 0.85, growth_pct: 0.035 },
        win_rate: { current: 0.47, previous: 0.5, growth_pct: -0.06 },
      },
    };
  }
}
