import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Conteos',
    pathMatch: 'full'
  },
  {
    path: 'counts',
    loadChildren: () => import('./pages/counts/counts.module').then( m => m.CountsPageModule)
    // TODO implement fire auth guard from @angular/fire/auth-guard
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
