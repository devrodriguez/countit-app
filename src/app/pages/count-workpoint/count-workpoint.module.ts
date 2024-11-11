import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CountWorkpointPageRoutingModule } from './count-workpoint-routing.module';

import { CountWorkpointPage } from './count-workpoint.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CountWorkpointPageRoutingModule
  ],
  declarations: [CountWorkpointPage]
})
export class CountWorkpointPageModule {}
