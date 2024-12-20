import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountWorkpointPage } from './count-workpoint.page';

const routes: Routes = [
  {
    path: '',
    component: CountWorkpointPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountWorkpointPageRoutingModule {}
