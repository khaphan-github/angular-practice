import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OverviewController } from './overview/overview.controller';
import { SalesRepPerformanceController } from './sales-rep-performance/sales-rep-performance.controller';
import { DealFunnelController } from './deal-funnel/deal-funnel.controller';
import { PipelineTrendsController } from './pipeline-trends/pipeline-trends.controller';
import { OutreachActivitiesController } from './outreach-activities/outreach-activities.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    OverviewController,
    SalesRepPerformanceController,
    DealFunnelController,
    PipelineTrendsController,
    OutreachActivitiesController,
  ],
  providers: [AppService],
})
export class AppModule {}
