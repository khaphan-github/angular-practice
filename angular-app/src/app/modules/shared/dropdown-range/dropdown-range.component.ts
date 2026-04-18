import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-dropdown-range',
  templateUrl: './dropdown-range.component.html',
  styleUrls: ['./dropdown-range.component.css']
})
export class DropdownRangeComponent implements OnInit {
  @Input() options: { label: string, value: string }[] = [];
  @Input() selectedValue: string = '';
  @Input() label: string = 'Select Range';
  @Output() optionSelected = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }

  selectOption(option: { label: string, value: string }) {
    this.selectedValue = option.value;
    this.optionSelected.emit(option.value);
  }
}
