import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventPage');
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
