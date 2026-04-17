import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./modules/dummy-dashboard/dummy-dashboard.component').then(m => m.DummyDashboardComponent)
  }
];
