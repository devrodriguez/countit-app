import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountBunchesPage } from './count-bunches.page';

const routes: Routes = [
  {
    path: '',
    component: CountBunchesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountBunchesPageRoutingModule {}
