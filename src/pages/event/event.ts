import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ToastController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';

import { VenuePage } from '../venue/venue'
import { HomePage } from '../home/home';

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
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private http: HTTP,
    private storage: Storage) {
    this.event = navParams.get('event');
    var splittedDate = this.event.event.start.split('T');
    splittedDate = splittedDate[0].split('-');
    var date = new Date(splittedDate[0], splittedDate[1], splittedDate[2]);
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var dayName = days[date.getDay()];
    this.event.event.modifiedStart = dayName + ", " + (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    this.event.event.stringDuration = this.getDurationString(this.event.event.duration);
    this.storage.get(this.event.event.facebook_id).then(result => {
      if(result != null){
        this.liked = result;
      }else{
        this.liked = "heart-outline";
      }
    });
  }

  ionViewDidLoad() {

  }

  likeEvent(){
    if(this.liked.indexOf("heart-outline") !== -1){
      this.liked = "heart";
      this.storage.set(this.event.event.facebook_id, "heart");
      this.checkUserId(this.sendPostWithId);
    }else{
      this.liked = "heart-outline";
      this.storage.set(this.event.event.facebook_id, "heart-outline");
    }
  }

  sendPostWithId(id){
    var params = {
      userId: id,
      eventId: this.event.event.facebook_id,
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
    this.http.get('http://52.56.35.31:8088/getVenue', {"id": this.event.event.venue.id}, {})
      .then(data => {
        var jsonData = JSON.parse(data.data);
        this.navCtrl.push(VenuePage, { venue: jsonData });
      })
      .catch(error => {
        this.presentToast("No page for this venue yet.");
        //this.presentToast(JSON.stringify(error, null, 4));
      });
    
  }

  getDurationString(duration) {
    if (duration[0] == 0) {
      if (duration[1] == 0) {
        if (duration[2] == 0) {
          if (duration[3] == 0) {
            return duration[4] + "min";
          } else {
            return duration[3] + "h" + duration[4];
          }
        } else {
          return duration[2] + " days";
        }
      } else {
        return duration[1] + " months";
      }
    } else {
      return duration[0] + " years and " + duration[1] + " months";
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
        this.storage.set("id",newId);
        functionToCall(newId);
      })
      .catch(error => {
        //this.presentToast("Error in new id request");
      });
  }

  checkUserId(functionToCall) {
    this.storage.get("id").then(result => {
      if(result != null){
        functionToCall(result);
      }else{
        this.askForNewUserId(functionToCall);
      }
    });
  }

}
