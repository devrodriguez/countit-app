import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountsPage } from './counts.page';

const routes: Routes = [
  {
    path: '',
    component: CountsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountsPageRoutingModule {}
