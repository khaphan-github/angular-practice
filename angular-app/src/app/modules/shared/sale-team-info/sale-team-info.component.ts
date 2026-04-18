import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type MetricValueType = 'currency' | 'number' | 'percent';

@Component({
  standalone: true,
  selector: 'app-sale-team-info',
  imports: [CommonModule],
  templateUrl: './sale-team-info.component.html',
  styleUrls: ['./sale-team-info.component.css']
})
export class SaleTeamInfoComponent {
  @Input() label = '';
  @Input() current = 0;
  @Input() previous = 0;
  @Input() growth_pct = 0;
  @Input() valueType: MetricValueType = 'currency';

  get formattedCurrent(): string {
    return this.formatValue(this.current);
  }

  get formattedPrevious(): string {
    return this.formatValue(this.previous);
  }

  get formattedGrowth(): string {
    const pct = Math.abs(this.growth_pct * 100).toFixed(1);
    return `${pct}%`;
  }

  get isPositiveGrowth(): boolean {
    return this.growth_pct >= 0;
  }

  private formatValue(value: number): string {
    if (this.valueType === 'percent') {
      return `${(value * 100).toFixed(0)}%`;
    }
    if (this.valueType === 'number') {
      return `${value}`;
    }
    // currency
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(1)}k`;
    }
    return `$${value}`;
  }
}
