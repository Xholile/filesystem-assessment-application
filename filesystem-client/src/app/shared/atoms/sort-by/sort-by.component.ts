import { Component, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FileEntry } from '../../../core/models/file-entry.model';

export interface SortOption {
  value: keyof FileEntry;
  direction: 'asc' | 'desc';
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { value: 'name', direction: 'asc', label: 'Sort by: Name A-Z' },
  { value: 'name', direction: 'desc', label: 'Sort by: Name Z-A' },
  { value: 'size', direction: 'desc', label: 'Sort by: Largest' },
  { value: 'size', direction: 'asc', label: 'Sort by: Smallest' },
  { value: 'createdAt', direction: 'desc', label: 'Sort by: Newest' },
  { value: 'createdAt', direction: 'asc', label: 'Sort by: Oldest' },
];

@Component({
  selector: 'app-sort-by',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <select
      class="form-select"
      [ngModel]="selectedIndex"
      (ngModelChange)="onSelect($event)">
      <option *ngFor="let option of options; let i = index" [value]="i">
        {{ option.label }}
      </option>
    </select>
  `
})
export class SortByComponent implements OnDestroy {
  @Input() options: SortOption[] = SORT_OPTIONS;
  @Output() sortChange = new EventEmitter<SortOption>();

  selectedIndex = 0;

  private destroy$ = new Subject<void>();

  onSelect(index: number): void {
    this.selectedIndex = index;
    this.sortChange.emit(this.options[index]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}