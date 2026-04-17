import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Deal Funnel')
@Controller('deal-funnel')
export class DealFunnelController {
  @Get()
  @ApiOperation({
    summary: 'Get deal counts by pipeline stage',
    description:
      'Returns the number of deals at each stage: Lead → Qualified → Proposal → Negotiation → Closed Won / Closed Lost.',
  })
  @ApiQuery({
    name: 'date_range',
    required: false,
    enum: ['this_quarter', 'this_month', 'this_year'],
    description: 'Time range for aggregation',
  })
  @ApiResponse({
    status: 200,
    description: 'Deal funnel data returned successfully.',
  })
  getDealFunnel(@Query('date_range') dateRange?: string) {
    return {
      date_range: dateRange ?? 'this_quarter',
      deal_funnel: [
        { stage: 'Lead', count: 150 },
        { stage: 'Qualified', count: 120 },
        { stage: 'Proposal', count: 90 },
        { stage: 'Negotiation', count: 60 },
        { stage: 'Closed Won', count: 45 },
        { stage: 'Closed Lost', count: 15 },
      ],
    };
  }
}
