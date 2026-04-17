import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Sales Performance Dashboard API')
    .setDescription('Mock API endpoints for the Sales Performance Dashboard')
    .setVersion('1.0')
    .addTag('Overview', 'KPI summary cards')
    .addTag('Sales Rep Performance', 'Revenue & deals per representative')
    .addTag('Deal Funnel', 'Deal counts by pipeline stage')
    .addTag('Pipeline Trends', 'Month-by-month pipeline movement')
    .addTag('Outreach Activities', 'Meeting & contact activity breakdowns')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
