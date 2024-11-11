import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'counts',
    loadChildren: () => import('./pages/counts/counts.module').then( m => m.CountsPageModule)
    // TODO implement fire auth guard from @angular/fire/auth-guard
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'count-workpoint',
    loadChildren: () => import('./pages/count-workpoint/count-workpoint.module').then( m => m.CountWorkpointPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
