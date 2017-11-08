import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  age = 0;
  favoriteTypesOfEvent = null;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private http: HTTP,
    private storage: Storage) {
    this.storage.get('age').then(result => {
      if (result != null) {
        this.age = result;
      }
    });
    this.storage.get('favTypes').then(result => {
      if (result != null) {
        this.favoriteTypesOfEvent = result;
        var badges = document.getElementById("badges");
        badges.innerHTML = "";
        for (var i = 0; i < this.favoriteTypesOfEvent.length; i++) {
          var badgeName = this.favoriteTypesOfEvent[i];
          badges.innerHTML += ' <span class="badge">' + badgeName + '</span>';
        }
      }
    });
  }

  ionViewDidLoad() {

  }

  saveProfile() {
    this.checkUserId(this.sendProfile);
  }

  sendProfile = (id: number): void => {
    if (this.age != 0) {
      this.storage.set("age",this.age);
      if (this.favoriteTypesOfEvent != null) {
        this.storage.set("favTypes",this.favoriteTypesOfEvent);
        this.http.get('http://52.56.35.31:8088/postProfile', { "id": id, "age": this.age, "favEvents": this.favoriteTypesOfEvent }, {})
          .then(data => {
            this.presentToast("Profile sucessfully saved.");
          })
          .catch(error => {
            this.presentToast("A problem occured while saving your profile. Please retry later.");
          });
      } else {
        this.presentToast("Please pick your favorite type of events.");
      }
    } else {
      this.presentToast("Please set an age higher than 0.");
    }
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  showCheckbox() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Select the type of events you want.');

    alert.addInput({
      type: 'checkbox',
      label: 'Concert',
      value: 'Concert',
      checked: false
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Dance and popular fest',
      value: 'Dance and popular fest',
      checked: false
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Exhibition',
      value: 'Exhibition',
      checked: false
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Conference',
      value: 'Conference',
      checked: false
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Party',
      value: 'Party',
      checked: false
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Show',
      value: 'Show',
      checked: false
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Theater',
      value: 'Theater',
      checked: false
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        this.favoriteTypesOfEvent = data;
        var badges = document.getElementById("badges");
        badges.innerHTML = "";
        for (var i = 0; i < data.length; i++) {
          var badgeName = data[i];
          badges.innerHTML += ' <span class="badge">' + badgeName + '</span>';
        }
      }
    });
    alert.present();
  }

  askForNewUserId(functionToCall) {
    this.http.get('http://52.56.35.31:8088/getNewId', {}, {})
      .then(data => {
        var newId = JSON.parse(data.data);
        this.storage.set("id",newId);
        functionToCall(newId);
      })
      .catch(error => {
        // TODO Change this, there shouldn't be an id there if it's not from the server
        functionToCall(1);
        //this.presentToast("Error in new id request");
      });
  }

  checkUserId(functionToCall) {
    this.storage.get("id").then(result => {
      if(result != null){
        functionToCall(window.localStorage.getItem("id"));
      }else{
        this.askForNewUserId(functionToCall);
      }
    });
  }

}
