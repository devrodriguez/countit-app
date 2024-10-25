import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CountBunchesPageRoutingModule } from './count-bunches-routing.module';

import { CountBunchesPage } from './count-bunches.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CountBunchesPageRoutingModule
  ],
  declarations: [CountBunchesPage]
})
export class CountBunchesPageModule {}
