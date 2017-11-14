import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LikedEventPage } from './liked-event';

@NgModule({
  declarations: [
    LikedEventPage,
  ],
  imports: [
    IonicPageModule.forChild(LikedEventPage),
  ],
})
export class LikedEventPageModule {}
