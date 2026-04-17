import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Pipeline Trends')
@Controller('pipeline-trends')
export class PipelineTrendsController {
  @Get()
  @ApiOperation({
    summary: 'Get month-by-month pipeline movement',
    description:
      'Returns a time-series of deal counts grouped by stage per month. Used for the Line chart.',
  })
  @ApiQuery({
    name: 'date_range',
    required: false,
    enum: ['this_quarter', 'this_month', 'this_year'],
    description: 'Time range for aggregation',
  })
  @ApiResponse({
    status: 200,
    description: 'Pipeline trend data returned successfully.',
  })
  getPipelineTrends(@Query('date_range') dateRange?: string) {
    return {
      date_range: dateRange ?? 'this_quarter',
      pipeline_trends: [
        {
          month: '2024-01',
          lead: 40,
          qualified: 30,
          proposal: 25,
          negotiation: 10,
          closed_won: 5,
        },
        {
          month: '2024-02',
          lead: 45,
          qualified: 34,
          proposal: 28,
          negotiation: 12,
          closed_won: 7,
        },
        {
          month: '2024-03',
          lead: 50,
          qualified: 38,
          proposal: 30,
          negotiation: 15,
          closed_won: 9,
        },
        {
          month: '2024-04',
          lead: 55,
          qualified: 42,
          proposal: 33,
          negotiation: 18,
          closed_won: 10,
        },
        {
          month: '2024-05',
          lead: 60,
          qualified: 45,
          proposal: 36,
          negotiation: 20,
          closed_won: 12,
        },
        {
          month: '2024-06',
          lead: 65,
          qualified: 50,
          proposal: 40,
          negotiation: 22,
          closed_won: 15,
        },
        {
          month: '2024-07',
          lead: 70,
          qualified: 54,
          proposal: 43,
          negotiation: 24,
          closed_won: 17,
        },
        {
          month: '2024-08',
          lead: 72,
          qualified: 56,
          proposal: 45,
          negotiation: 26,
          closed_won: 18,
        },
        {
          month: '2024-09',
          lead: 75,
          qualified: 58,
          proposal: 47,
          negotiation: 28,
          closed_won: 20,
        },
        {
          month: '2024-10',
          lead: 78,
          qualified: 60,
          proposal: 50,
          negotiation: 30,
          closed_won: 22,
        },
        {
          month: '2024-11',
          lead: 80,
          qualified: 63,
          proposal: 52,
          negotiation: 32,
          closed_won: 24,
        },
        {
          month: '2024-12',
          lead: 85,
          qualified: 67,
          proposal: 55,
          negotiation: 35,
          closed_won: 27,
        },
      ],
    };
  }
}
