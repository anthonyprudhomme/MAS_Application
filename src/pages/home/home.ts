import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { App, MenuController } from 'ionic-angular';

import { FirstPage } from '../first/first'
import { EventPage } from '../event/event'
import { SchedulePage } from '../schedule/schedule'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  firstPage = FirstPage;
  eventPage = EventPage;
  schedulePage = SchedulePage;
  constructor(public navCtrl: NavController) {

  }
  items = [
    'Orchestra',
    'Play',
    'Best event ever'
  ];

  itemSelected(item: string) {
    console.log("Selected Item", item);
  }

}