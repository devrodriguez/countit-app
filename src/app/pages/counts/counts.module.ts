import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CountsPageRoutingModule } from './counts-routing.module';

import { CountsPage } from './counts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CountsPageRoutingModule
  ],
  declarations: [CountsPage]
})
export class CountsPageModule {}
