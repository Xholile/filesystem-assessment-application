// filesystem.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileEntry } from '../models/file-entry.model';

export interface PaginatedResult {
  data: FileEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class FilesystemService {

  private baseUrl = 'http://localhost:3000/filesystem';

  constructor(private http: HttpClient) {}

  getDirectory(path: string = '/host', page: number = 1, limit: number = 50): Observable<PaginatedResult> {
    const params = new HttpParams()
      .set('path', path)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResult>(this.baseUrl, { params });
  }
}