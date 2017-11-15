import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { App, MenuController } from 'ionic-angular';

import { DatePicker } from '@ionic-native/date-picker';
import { ToastController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { EventPage } from '../event/event'
import { HomePage } from '../home/home'

@IonicPage()
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {
  showFilters = false;
  now = new Date();
  price = 0;
  duration = 0;
  distance = 0;
  startHour = this.formatDate(this.now);
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', "Sep", 'Oct', 'Nov', 'Dec'];
  dayName = this.days[this.now.getDay()];
  monthName = this.months[this.now.getMonth() + 1];
  searchedName = null;

  selectedEvent = null;
  currentLoading = null;
  //startDate = this.days[this.now.getDay()] + " " + this.months[this.now.getMonth()] + ' ' + this.now.getDate() + ' ' + this.now.getFullYear();
  startDate = null;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private datePicker: DatePicker,
    public toastCtrl: ToastController,
    private http: HTTP,
    public platform: Platform,
    private alertCtrl: AlertController,
    private storage: Storage,
    public loadingCtrl: LoadingController) {
  }

  formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes;
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      if (this.platform.is('ios')) {
        this.startDate = new Date().toISOString();
      } else {
        this.startDate = this.days[this.now.getDay()] + " " + this.months[this.now.getMonth()] + ' ' + this.now.getDate() + ' ' + this.now.getFullYear();
      }
      this.currentLoading = this.presentLoadingDefault();
      this.http.get('http://52.56.35.31:8088/getData', {}, {})
        .then(data => {
          var jsonData = JSON.parse(data.data);
          this.fillEventList(jsonData);
          this.currentLoading.dismiss();
        })
        .catch(error => {
          this.currentLoading.dismiss();
          // this.fillEventList(
          //   {
          //     "events": [
          //       { "event": { "type_of_event": "TODO", "start": "2017-10-25T10:00:00+0200", "duration": [0, 0, 0, 2, 30], "views": [], "lang": "TODO", "end": "2017-10-27T11:30:00+0200", "price": 15, "description": "Pour les vacances de la Toussaint, le Centre Pompidou-Metz propose un stage de 3 jours pour les 8-12 ans en lien avec l'exposition d'architecture \"Japan-Ness\".\n\nL'atelier de l'artiste Vincent Broquaire propose d\u2019explorer l\u2019architecture des mus\u00e9es \u00e0 travers le b\u00e2timent du Centre Pompidou-Metz ainsi que certains \u00e9difices pr\u00e9sent\u00e9s dans Japan-Ness. M\u00e9canismes, formes organiques, personnages dans de dr\u00f4les d\u2019ascenseurs : le travail de Vincent Broquaire d\u00e9cortique l\u2019architecture et m\u00e9lange l'imaginaire, le scientifique, l'absurde et l'inattendu.\n\n\u00c0 partir de ces architectures inattendues, les enfants pourront \u00e0 leur tour imaginer l'architecture et le fonctionnement d'un mus\u00e9e, tout d\u2019abord en compl\u00e9tant les sch\u00e9mas de Vincent Broquaire, puis librement, en cr\u00e9ant un livret qu\u2019ils ram\u00e8neront \u00e0 la maison.\n\nTarif : 15\u20ac\nDur\u00e9e : 3 x 90 minutes\nMER. 25.10 + JEU. 26.10 + VEN. 27.10.17, de 10:00 \u00e0 11:30", "name": "Stage Architectomies [8-12 ans / vacances de la Toussaint]", "facebook_id": "824531944380629", "GPS": { "lat": 49.107988299011, "lon": 6.1811848399707 }, "likes": [], "address": "1 parvis des Droits de l'Homme, 57000, Metz, France", "picture_url": "https://scontent.xx.fbcdn.net/v/t31.0-0/p480x480/22424657_10159435578300123_2793622685410336547_o.jpg?oh=dcbe21fb27974339d619a8c5cac442b5&oe=5A6622D2" } },
          //       { "event": { "type_of_event": "TODO", "start": "2017-10-22T16:00:00+0200", "duration": [1, 2, 3, 0, 0], "views": [], "lang": "TODO", "end": "2017-10-22T16:45:00+0200", "price": null, "description": "Cr\u00e9ateur d\u2019installations sonores et visuelles, Fuyuki Yamakawa d\u00e9veloppe parall\u00e8lement des performances en collaboration avec des artistes de disciplines tr\u00e8s diff\u00e9rentes : danse, mode, cin\u00e9ma, radio.\nSon \u0153uvre engag\u00e9e se teinte d\u2019une forte critique sociale depuis la catastrophe de Fukushima. Dans ses performances les plus connues, il reprend et amplifie le son des battements de son c\u0153ur avec un st\u00e9thoscope \u00e9lectronique. Ce dispositif d\u00e9clenche l\u2019allumage d\u2019une s\u00e9rie d\u2019ampoules qui oscillent en suivant ses battements. L\u2019artiste parvient \u00e0 moduler ce rythme gr\u00e2ce \u00e0 sa maitrise exceptionnelle d\u2019une technique vocale issue du chant mongol khoomei, caract\u00e9ris\u00e9e par l\u2019\u00e9mission simultan\u00e9e de deux sons.\n\n\u00c0 partir de 10 ans.\n\nEntr\u00e9e libre sur pr\u00e9sentation d\u2019un billet d\u2019acc\u00e8s aux expositions du jour, dans la limite des places disponibles.\n\nGratuit pour les titulaires du Pass-M et Pass-M jeunes, - de 26 ans, demandeurs d'emploi, allocataires RSA ou de l'aide sociale (sur pr\u00e9sentation d'un justificatif de - 6 mois), membres de la Maison des artistes, adh\u00e9rents du Centre Pompidou).", "name": "Performance musicale de Fuyuki Yamakawa [Evening #2]", "facebook_id": "1887608281568117", "GPS": { "lat": 49.107988299011, "lon": 6.1811848399707 }, "likes": [], "address": "1 parvis des Droits de l'Homme, 57000, Metz, France", "picture_url": "https://scontent.xx.fbcdn.net/v/t31.0-8/s720x720/22338750_10159427120330123_6032839780793330900_o.jpg?oh=a92e56228684f1d1b04eb6d457da6b26&oe=5A83071E" } },
          //       { "event": { "likes": [], "start": "2017-10-22T14:30:00+0200", "type_of_event": "TODO", "views": [], "duration": [0, 0, 3, 0, 0], "lang": "TODO", "picture_url": "https://scontent.xx.fbcdn.net/v/t31.0-8/s720x720/22179895_10159401312890123_2725534430868585804_o.jpg?oh=9d58d5b312ee4fababf17ffe551689ce&oe=5A6546CD", "price": null, "description": "Kazuyo Sejima, architecte fondatrice de l'agence SANAA  et sc\u00e9nographe de l\u2019exposition \"Japanorama\", rencontre Yuko Hasegawa, commissaire de l\u2019exposition \"Japanorama\"\n\nL\u2019agence SANAA, fond\u00e9e par Kazuyo Sejima et Ryue Nishizawa en 1995, est l\u2019une des plus prestigieuses agences d\u2019architecture contemporaine au Japon mais aussi sur la sc\u00e8ne internationale. Prix Pritzker 2010, elle s\u2019est entre autres illustr\u00e9e par des r\u00e9alisations mus\u00e9ales majeures comme le New Museum de New York ou le Louvre-Lens. Pour l\u2019exposition \"Japanorama\", l\u2019agence SANAA a con\u00e7u une sc\u00e9nographie dans laquelle on retrouve sa signature : la transparence, le d\u00e9cloisonnement de l\u2019espace et la fluidit\u00e9 du parcours, permettant au visiteur de d\u00e9ambuler librement entre les \u0153uvres.\n\nLa rencontre se d\u00e9roulera en japonais et sera traduite en fran\u00e7ais.\nEntr\u00e9e libre sur pr\u00e9sentation d\u2019un billet d\u2019acc\u00e8s aux expositions du jour, dans la limite des places disponibles.", "name": "Rencontre entre Kazuyo Sejima et Yuko Hasegawa [Evening n\u00b02]", "facebook_id": "2397921047100159", "GPS": { "lat": 49.107988299011, "lon": 6.1811848399707 }, "end": null, "address": "1 parvis des Droits de l'Homme, 57000, Metz, France" } }]
          //   });

        });

    });
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

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  setDateValue(value) {
    document.getElementById("startDate").innerHTML = value;
  }

  presentLoadingDefault() {
    var loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    return loading;
  }

  search() {
    this.currentLoading = this.presentLoadingDefault();
    this.http.get('http://52.56.35.31:8088/getFilteredData', { "price": this.price,
    duration: (this.duration / 4)*60,
    //startDate: this.startDate,
    //startHour: this.startHour,
    "distance": this.distance / 10,
    //typeOfEvent: null,
    "userPosition_lat": HomePage.userPosition.lat,
    "userPosition_lon": HomePage.userPosition.lon,
    "name": this.searchedName }, {})
      .then(data => {
        this.currentLoading.dismiss();
        var jsonData = JSON.parse(data.data);
        this.fillEventList(jsonData);
      })
      .catch(error => {
        this.currentLoading.dismiss();
        // this.fillEventList({
        //   "events": [
        //     { "event": { "venue": { "id": 1, "name": "Cité musicale de Metz" }, "type_of_event": "TODO", "start": "2017-10-25T10:00:00+0200", "duration": [0, 0, 0, 2, 30], "views": [], "lang": "TODO", "end": "2017-10-27T11:30:00+0200", "price": 25, "description": "Pour les vacances de la Toussaint, le Centre Pompidou-Metz propose un stage de 3 jours pour les 8-12 ans en lien avec l'exposition d'architecture \"Japan-Ness\".\n\nL'atelier de l'artiste Vincent Broquaire propose d\u2019explorer l\u2019architecture des mus\u00e9es \u00e0 travers le b\u00e2timent du Centre Pompidou-Metz ainsi que certains \u00e9difices pr\u00e9sent\u00e9s dans Japan-Ness. M\u00e9canismes, formes organiques, personnages dans de dr\u00f4les d\u2019ascenseurs : le travail de Vincent Broquaire d\u00e9cortique l\u2019architecture et m\u00e9lange l'imaginaire, le scientifique, l'absurde et l'inattendu.\n\n\u00c0 partir de ces architectures inattendues, les enfants pourront \u00e0 leur tour imaginer l'architecture et le fonctionnement d'un mus\u00e9e, tout d\u2019abord en compl\u00e9tant les sch\u00e9mas de Vincent Broquaire, puis librement, en cr\u00e9ant un livret qu\u2019ils ram\u00e8neront \u00e0 la maison.\n\nTarif : 15\u20ac\nDur\u00e9e : 3 x 90 minutes\nMER. 25.10 + JEU. 26.10 + VEN. 27.10.17, de 10:00 \u00e0 11:30", "name": "Stage Architectomies [8-12 ans / vacances de la Toussaint]", "facebook_id": "824531944380629", "GPS": { "lat": 49.107988299011, "lon": 6.1811848399707 }, "likes": [], "address": "1 parvis des Droits de l'Homme, 57000, Metz, France", "picture_url": "https://scontent.xx.fbcdn.net/v/t31.0-0/p480x480/22424657_10159435578300123_2793622685410336547_o.jpg?oh=dcbe21fb27974339d619a8c5cac442b5&oe=5A6622D2" } },
        //     { "event": { "venue": { "id": 2, "name": "BAM" }, "type_of_event": "TODO", "start": "2017-10-22T16:00:00+0200", "duration": [1, 2, 3, 0, 0], "views": [], "lang": "TODO", "end": "2017-10-22T16:45:00+0200", "price": 12, "description": "Cr\u00e9ateur d\u2019installations sonores et visuelles, Fuyuki Yamakawa d\u00e9veloppe parall\u00e8lement des performances en collaboration avec des artistes de disciplines tr\u00e8s diff\u00e9rentes : danse, mode, cin\u00e9ma, radio.\nSon \u0153uvre engag\u00e9e se teinte d\u2019une forte critique sociale depuis la catastrophe de Fukushima. Dans ses performances les plus connues, il reprend et amplifie le son des battements de son c\u0153ur avec un st\u00e9thoscope \u00e9lectronique. Ce dispositif d\u00e9clenche l\u2019allumage d\u2019une s\u00e9rie d\u2019ampoules qui oscillent en suivant ses battements. L\u2019artiste parvient \u00e0 moduler ce rythme gr\u00e2ce \u00e0 sa maitrise exceptionnelle d\u2019une technique vocale issue du chant mongol khoomei, caract\u00e9ris\u00e9e par l\u2019\u00e9mission simultan\u00e9e de deux sons.\n\n\u00c0 partir de 10 ans.\n\nEntr\u00e9e libre sur pr\u00e9sentation d\u2019un billet d\u2019acc\u00e8s aux expositions du jour, dans la limite des places disponibles.\n\nGratuit pour les titulaires du Pass-M et Pass-M jeunes, - de 26 ans, demandeurs d'emploi, allocataires RSA ou de l'aide sociale (sur pr\u00e9sentation d'un justificatif de - 6 mois), membres de la Maison des artistes, adh\u00e9rents du Centre Pompidou).", "name": "Performance musicale de Fuyuki Yamakawa [Evening #2]", "facebook_id": "1887608281568117", "GPS": { "lat": 49.107988299011, "lon": 6.1811848399707 }, "likes": [], "address": "1 parvis des Droits de l'Homme, 57000, Metz, France", "picture_url": "https://scontent.xx.fbcdn.net/v/t31.0-8/s720x720/22338750_10159427120330123_6032839780793330900_o.jpg?oh=a92e56228684f1d1b04eb6d457da6b26&oe=5A83071E" } },
        //     { "event": { "venue": { "id": 3, "name": "Arsenal" }, "likes": [], "start": "2017-10-22T14:30:00+0200", "type_of_event": "TODO", "views": [], "duration": [0, 0, 3, 0, 0], "lang": "TODO", "picture_url": "https://scontent.xx.fbcdn.net/v/t31.0-8/s720x720/22179895_10159401312890123_2725534430868585804_o.jpg?oh=9d58d5b312ee4fababf17ffe551689ce&oe=5A6546CD", "price": 15, "description": "Kazuyo Sejima, architecte fondatrice de l'agence SANAA  et sc\u00e9nographe de l\u2019exposition \"Japanorama\", rencontre Yuko Hasegawa, commissaire de l\u2019exposition \"Japanorama\"\n\nL\u2019agence SANAA, fond\u00e9e par Kazuyo Sejima et Ryue Nishizawa en 1995, est l\u2019une des plus prestigieuses agences d\u2019architecture contemporaine au Japon mais aussi sur la sc\u00e8ne internationale. Prix Pritzker 2010, elle s\u2019est entre autres illustr\u00e9e par des r\u00e9alisations mus\u00e9ales majeures comme le New Museum de New York ou le Louvre-Lens. Pour l\u2019exposition \"Japanorama\", l\u2019agence SANAA a con\u00e7u une sc\u00e9nographie dans laquelle on retrouve sa signature : la transparence, le d\u00e9cloisonnement de l\u2019espace et la fluidit\u00e9 du parcours, permettant au visiteur de d\u00e9ambuler librement entre les \u0153uvres.\n\nLa rencontre se d\u00e9roulera en japonais et sera traduite en fran\u00e7ais.\nEntr\u00e9e libre sur pr\u00e9sentation d\u2019un billet d\u2019acc\u00e8s aux expositions du jour, dans la limite des places disponibles.", "name": "Rencontre entre Kazuyo Sejima et Yuko Hasegawa [Evening n\u00b02]", "facebook_id": "2397921047100159", "GPS": { "lat": 49.107988299011, "lon": 6.1811848399707 }, "end": null, "address": "1 parvis des Droits de l'Homme, 57000, Metz, France" } }
        //   ]
        // });
      });
  }

  fillEventList(jsonData) {
    console.log("filling list");
    this.events = new Array();
    for (var i = 0; i < jsonData.length; i++) {
      var currentEvent = jsonData[i];
      if (currentEvent != null) {
        if (currentEvent.price == null) {
          currentEvent.price = 0;
        }
        if (currentEvent.score == null) {
          currentEvent.score = i;
        }
        if (currentEvent.distance == null) {
          currentEvent.distance = jsonData.length - i;
        }
        var splittedDate = currentEvent.start.split('T');
        splittedDate = splittedDate[0].split('-');
        var date = new Date(splittedDate[0], splittedDate[1], splittedDate[2]);
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var dayName = days[date.getDay()];
        currentEvent.modifiedStart = dayName + ", " + (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        this.events.push(currentEvent);
      }
    }
  }

  events = [
    // { event: { name: 'Orchestra', start: "10PM", price: 0, distance: 0.3, picture_url: "assets/img/event_icon.png", duration: 10, score: 15 } },
    // { event: { name: 'Play', start: "11PM", price: 10, distance: 0.5, picture_url: "assets/img/event_icon.png", duration: 15, score: 10 } },
    // { event: { name: 'Conference', start: "5AM", price: 0, distance: 1.2, picture_url: "assets/img/event_icon.png", duration: 5, score: 17 } }
  ];

  sortByPrice() {
    this.events.sort(function (a, b) {
      return a.price - b.price;
    });
  }

  sortByDuration() {
    this.events.sort(function (a, b) {
      var duration_a = a.duration_year*12*31*24*60 + a.duration_month*31*24*60 + a.duration_day*24*60 + a.duration_hour*60 + a.duration_minutes
      var duration_b = b.duration_year*12*31*24*60 + b.duration_month*31*24*60 + b.duration_day*24*60 + b.duration_hour*60 + b.duration_minutes;
      return Math.abs(duration_a) - Math.abs(duration_b);
    });
  }

  sortByScore() {
    this.events.sort(function (a, b) {
      return a.score - b.score;
    });
  }

  sortByDistance() {
    this.events.sort(function (a, b) {
      var distance_a_user = a.GPS_lat - HomePage.userPosition.lat + a.GPS_lon - HomePage.userPosition.lon;
      var distance_b_user = b.GPS_lat - HomePage.userPosition.lat + b.GPS_lon - HomePage.userPosition.lon;
      return distance_b_user - distance_a_user;
    });
  }

  eventSelected(event) {
    this.selectedEvent = event;
    this.navCtrl.push(EventPage, { event: event });
    //this.checkUserId(this.sendPostWithId);
  }

  showingFilters() {
    this.showFilters = !this.showFilters;
    if (this.showFilters) {
      document.getElementById("showFilterElement").innerHTML = "Show filters";
    } else {
      document.getElementById("showFilterElement").innerHTML = "Hide filters";
    }
  }

  sendPostWithId(id) {
    var params = {
      userId: id,
      eventId: this.selectedEvent,
      userPosition_lat: HomePage.userPosition.lat,
      userPosition_lon: HomePage.userPosition.lon
    }
    this.http.post('http://52.56.35.31:8088/clickedEvent', { params }, {})
      .then(data => {
      })
      .catch(error => {
        //this.presentToast("Error in new id request");
      });
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
