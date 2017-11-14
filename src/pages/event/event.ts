import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ToastController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';

import { VenuePage } from '../venue/venue'
import { HomePage } from '../home/home';

//import { TranslateService } from '@ngx-translate/core';

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
  event;
  liked = "heart-outline";
  likedEvents = null;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private http: HTTP,
    private storage: Storage) {

    //translate.setDefaultLang('en');
    this.event = navParams.get('event');
    var splittedDate = this.event.start.split('T');
    splittedDate = splittedDate[0].split('-');
    var date = new Date(splittedDate[0], splittedDate[1], splittedDate[2]);
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var dayName = days[date.getDay()];
    this.event.modifiedStart = dayName + ", " + (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    this.event.stringDuration = this.getDurationString(this.event);
    this.storage.get(this.event.facebook_id).then(result => {
      if (result != null) {
        this.liked = result;
      } else {
        this.liked = "heart-outline";
      }
    });
    this.storage.get("likedEvents").then(result => {
      if (result != null) {
        this.likedEvents = result;
      } else {
        this.likedEvents = [];
      }
    });
    //this.event.event.localizedDesc = translate.getTranslation(this.event.event.description);
  }

  ionViewDidLoad() {

  }

  likeEvent() {
    if (this.liked.indexOf("heart-outline") !== -1) {
      // if we are liking the event
      this.liked = "heart";
      this.storage.set(this.event.facebook_id, "heart");
      this.checkUserId(this.sendPostWithId);
      this.likedEvents.push(this.event);
      this.storage.set("likedEvents", this.likedEvents);
    } else {
      // if we are disliking the event
      this.liked = "heart-outline";
      this.storage.set(this.event.facebook_id, "heart-outline");
      for (let i = 0; i < this.likedEvents.length; i++) {
        const event = this.likedEvents[i];
        if (event.facebook_id.indexOf(this.event.facebook_id) != -1) {
          this.likedEvents.splice(i, 1);
        }
      }
      this.storage.set("likedEvents", this.likedEvents);
    }
  }

  sendPostWithId(id) {
    var params = {
      userId: id,
      eventId: this.event.facebook_id,
      userPosition_lat: HomePage.userPosition.lat,
      userPosition_lon: HomePage.userPosition.lon
    }
    this.http.post('http://52.56.35.31:8088/likedEvent', { params }, {})
      .then(data => {
      })
      .catch(error => {
        //this.presentToast("Error in new id request");
      });
  }

  goToVenuePage() {
    this.http.get('http://52.56.35.31:8088/getVenue', { "id": this.event.event.venue.id }, {})
      .then(data => {
        var jsonData = JSON.parse(data.data);
        this.navCtrl.push(VenuePage, { venue: jsonData });
      })
      .catch(error => {
        this.presentToast("No page for this venue yet.");
        //this.presentToast(JSON.stringify(error, null, 4));
      });

  }

  getDurationString(event) {
    if (event.duration_year == 0) {
      if (event.duration_month == 0) {
        if (event.duration_day == 0) {
          if (event.duration_hour == 0) {
            return event.duration_minute + "min";
          } else {
            return event.duration_hour + "h" + event.duration_minute;
          }
        } else {
          return event.duration_day + " days";
        }
      } else {
        return event.duration_month + " months";
      }
    } else {
      return event.duration_year + " years and " + event.duration_month + " months";
    }
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  askForNewUserId(functionToCall) {
    this.http.get('http://52.56.35.31:8088/getNewId', {}, {})
      .then(data => {
        var newId = JSON.parse(data.data);
        this.storage.set("id", newId);
        functionToCall(newId);
      })
      .catch(error => {
        //this.presentToast("Error in new id request");
      });
  }

  checkUserId(functionToCall) {
    this.storage.get("id").then(result => {
      if (result != null) {
        functionToCall(result);
      } else {
        this.askForNewUserId(functionToCall);
      }
    });
  }

}
