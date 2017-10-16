import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { App, MenuController } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { ToastController } from 'ionic-angular';
/**
 * Generated class for the SchedulePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {
  startDate : string = "test";
  constructor(public navCtrl: NavController, public navParams: NavParams, private datePicker: DatePicker,public toastCtrl: ToastController) {
    this.datePicker = datePicker;
    this.startDate = "test";
  }

  items = [
    'Orchestra',
    'Play',
    'Best event ever',
    'Best event ever',
    'Best event ever',
    'Best event ever',
    'Best event ever'
  ];
  currentDate: String = new Date().toISOString();
  public startDateOfEvent = {
    date: '02-19',
    timeStarts: '07:43'
  }

  itemSelected(item: string) {
    console.log("Selected Item", item);
  }
  datePickerClicked(item: string) {
    
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then(
      date => this.setDateValue(date.toDateString()),
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  presentToast(value) {
    let toast = this.toastCtrl.create({
      message: value,
      duration: 3000
    });
    toast.present();
  }

  setDateValue(value) {
    document.getElementById("test").innerHTML = value;
  }
}
