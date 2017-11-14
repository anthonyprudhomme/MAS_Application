import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { EventPage } from '../event/event'

/**
 * Generated class for the LikedEventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-liked-event',
  templateUrl: 'liked-event.html',
})
export class LikedEventPage {

  likedEvents = null;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public storage: Storage) {

  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.storage.get("likedEvents").then(result => {
        if (result != null) {
          this.likedEvents = result;
        } else {
          this.likedEvents = [];
        }
      });
    });
  }

  eventSelected(event) {
    this.navCtrl.push(EventPage, { event: event });
  }

}
