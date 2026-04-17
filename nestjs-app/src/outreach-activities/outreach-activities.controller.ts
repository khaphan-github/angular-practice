import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Outreach Activities')
@Controller('outreach-activities')
export class OutreachActivitiesController {
  @Get()
  @ApiOperation({
    summary: 'Get meeting & contact activity breakdown',
    description:
      'Returns contacts and meetings per rep, plus a breakdown of meeting types (Intro Call, Demo, Follow-up, etc.).',
  })
  @ApiQuery({
    name: 'date_range',
    required: false,
    enum: ['this_quarter', 'this_month', 'this_year'],
    description: 'Time range for aggregation',
  })
  @ApiResponse({
    status: 200,
    description: 'Outreach activity data returned successfully.',
  })
  getOutreachActivities(@Query('date_range') dateRange?: string) {
    return {
      date_range: dateRange ?? 'this_quarter',
      outreach_activities: {
        by_rep: [
          { rep_name: 'Alice Johnson', contacts: 52, meetings: 26 },
          { rep_name: 'Bob Smith', contacts: 68, meetings: 34 },
          { rep_name: 'Carol White', contacts: 45, meetings: 20 },
          { rep_name: 'David Lee', contacts: 80, meetings: 42 },
          { rep_name: 'Eva Martinez', contacts: 58, meetings: 30 },
          { rep_name: 'Frank Chen', contacts: 72, meetings: 38 },
        ],
        meeting_types: [
          { type: 'Intro Call', count: 38.6 },
          { type: 'Demo Call', count: 26.2 },
          { type: 'Follow-up', count: 18.5 },
          { type: 'Negotiation', count: 10.3 },
          { type: 'Closing Call', count: 6.4 },
        ],
      },
    };
  }
}
