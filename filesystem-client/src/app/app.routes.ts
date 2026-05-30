import { Routes } from '@angular/router';
import { FileExplorerComponent } from './features/file-explorer/pages/file-explorer/file-explorer.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'files',
    pathMatch: 'full'
  },
  {
    path: 'files',
    component: FileExplorerComponent
  }
];