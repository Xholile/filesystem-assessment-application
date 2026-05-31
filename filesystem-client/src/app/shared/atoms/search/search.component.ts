import { Component, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="input-group">
      <span class="input-group-text bg-white border-end-0">🔍</span>
      <input
        type="text"
        class="form-control border-start-0"
        [placeholder]="placeholder"
        [ngModel]="searchTerm"
        (ngModelChange)="onInputChange($event)"
      />
      <button
        *ngIf="searchTerm"
        class="btn btn-outline-secondary border-start-0"
        type="button"
        (click)="clear()"
      >
        ✕
      </button>
    </div>
  `
})
export class SearchComponent implements OnDestroy {
  @Input() placeholder = 'Search files and folders...';
  @Input() delay = 1000;
  @Output() search = new EventEmitter<string>();

  searchTerm = '';
  private input$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor() {
    this.input$.pipe(
      debounceTime(this.delay),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => this.search.emit(value));
  }

  onInputChange(value: string): void {
    this.searchTerm = value;
    this.input$.next(value);
  }

  clear(): void {
    this.searchTerm = '';
    this.input$.next('');
    this.search.emit('');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}