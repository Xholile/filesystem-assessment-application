import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, switchMap, tap, catchError, of, map, shareReplay } from 'rxjs';
import { FileEntry } from '../../../../core/models/file-entry.model';
import { FilesystemService } from '../../../../core/services/filesystem';

@Component({
  selector: 'app-file-explorer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file-explorer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileExplorerComponent implements OnInit {

  private path$ = new BehaviorSubject<string>('/host');
  private search$ = new BehaviorSubject<string>('');
  private sortField$ = new BehaviorSubject<keyof FileEntry>('name');
  private sortAsc$ = new BehaviorSubject<boolean>(true);
  private page$ = new BehaviorSubject<number>(1);

  readonly pageSize = 50;
  error: string | null = null;

  readonly breadcrumbs$ = this.path$.pipe(
    map(path => {
      const parts = path.split('/').filter(Boolean);
      return parts.reduce((acc, part, i) => {
        const fullPath = '/' + parts.slice(0, i + 1).join('/');
        return [...acc, { label: part, path: fullPath }];
      }, [{ label: 'root', path: '/host' }] as { label: string; path: string }[]);
    })
  );

  readonly loading$ = new BehaviorSubject<boolean>(false);

  // Fetch paginated results from backend when path or page changes
  private result$ = combineLatest([this.path$, this.page$]).pipe(
    tap(() => {
      this.error = null;
      this.loading$.next(true);
    }),
    switchMap(([path, page]) =>
      this.fsService.getDirectory(path, page, this.pageSize).pipe(
        catchError(err => {
          this.error = err?.error?.message || 'Failed to load directory';
          this.loading$.next(false);
          return of(null);
        })
      )
    ),
    tap(() => this.loading$.next(false)),
    shareReplay(1)
  );

  // Apply client-side search and sort on current page data only
  readonly files$ = combineLatest([
    this.result$.pipe(map(r => r?.data ?? [])),
    this.search$,
    this.sortField$,
    this.sortAsc$,
  ]).pipe(
    map(([entries, search, sortField, sortAsc]) => {
      const filtered = entries.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase())
      );
      return [...filtered].sort((a, b) => {
        if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
        const aVal = a[sortField] ?? '';
        const bVal = b[sortField] ?? '';
        return sortAsc
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    })
  );

  readonly totalCount$ = this.result$.pipe(map(r => r?.total ?? 0));
  readonly totalPages$ = this.result$.pipe(map(r => r?.totalPages ?? 0));
  readonly currentPage$ = this.page$.asObservable();
  readonly currentPath$ = this.path$.asObservable();

  constructor(private fsService: FilesystemService) {}

  ngOnInit(): void {}

  navigateTo(path: string): void {
    this.path$.next(path);
    this.page$.next(1);
  }

  openDirectory(file: FileEntry): void {
    if (!file.isDirectory) return;
    this.path$.next(file.fullPath);
    this.page$.next(1);
  }

  onSearch(value: string): void {
    this.search$.next(value);
  }

  sortBy(field: keyof FileEntry): void {
    if (this.sortField$.value === field) {
      this.sortAsc$.next(!this.sortAsc$.value);
    } else {
      this.sortField$.next(field);
      this.sortAsc$.next(true);
    }
  }

  goToPage(page: number): void {
    this.page$.next(page);
  }

  prevPage(): void {
    const current = this.page$.value;
    if (current > 1) this.page$.next(current - 1);
  }

  nextPage(): void {
    this.page$.next(this.page$.value + 1);
  }

  getSortIcon(field: keyof FileEntry): string {
    if (this.sortField$.value !== field) return '↕';
    return this.sortAsc$.value ? '↑' : '↓';
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${(bytes / 1073741824).toFixed(1)} GB`;
  }

  getPageNumbers(totalPages: number): number[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const current = this.page$.value;
    const pages = new Set([1, totalPages, current, current - 1, current + 1].filter(p => p >= 1 && p <= totalPages));
    return Array.from(pages).sort((a, b) => a - b);
  }

  formatPermissions(octal: string): string {
    const map: Record<string, string> = {
      '0': '---', '1': '--x', '2': '-w-', '3': '-wx',
      '4': 'r--', '5': 'r-x', '6': 'rw-', '7': 'rwx'
    };
    return octal.split('').map(d => map[d] ?? '?').join('');
  }
}