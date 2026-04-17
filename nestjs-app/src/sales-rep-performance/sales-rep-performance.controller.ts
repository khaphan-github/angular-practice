import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Sales Rep Performance')
@Controller('sales-rep-performance')
export class SalesRepPerformanceController {
  @Get()
  @ApiOperation({
    summary: 'Get revenue & deals per sales rep',
    description:
      'Returns per-rep breakdown of revenue, deals closed, and quota attainment. Used for the Pie and Combo charts.',
  })
  @ApiQuery({
    name: 'date_range',
    required: false,
    enum: ['this_quarter', 'this_month', 'this_year'],
    description: 'Time range for aggregation',
  })
  @ApiResponse({
    status: 200,
    description: 'Sales rep performance data returned successfully.',
  })
  getSalesRepPerformance(@Query('date_range') dateRange?: string) {
    return {
      date_range: dateRange ?? 'this_quarter',
      sales_rep_performance: [
        {
          rep_id: 'rep_1',
          rep_name: 'Alice Johnson',
          revenue: 32000,
          deals_closed: 8,
          quota_attainment: 0.62,
        },
        {
          rep_id: 'rep_2',
          rep_name: 'Bob Smith',
          revenue: 47500,
          deals_closed: 12,
          quota_attainment: 0.91,
        },
        {
          rep_id: 'rep_3',
          rep_name: 'Carol White',
          revenue: 28000,
          deals_closed: 7,
          quota_attainment: 0.54,
        },
        {
          rep_id: 'rep_4',
          rep_name: 'David Lee',
          revenue: 61000,
          deals_closed: 15,
          quota_attainment: 1.17,
        },
        {
          rep_id: 'rep_5',
          rep_name: 'Eva Martinez',
          revenue: 39500,
          deals_closed: 10,
          quota_attainment: 0.76,
        },
        {
          rep_id: 'rep_6',
          rep_name: 'Frank Chen',
          revenue: 52000,
          deals_closed: 13,
          quota_attainment: 1.0,
        },
      ],
    };
  }
}
