import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { App, MenuController } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
import { HTTP } from '@ionic-native/http';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Geolocation } from '@ionic-native/geolocation';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { EventPage } from '../event/event'
import { ProfilePage } from '../profile/profile'
import { SchedulePage } from '../schedule/schedule'
import { LikedEventPage } from '../liked-event/liked-event'
import { Event } from '../../app/models/Event'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  isMapLoaded = false;
  selectedEvent = null;

  map: GoogleMap;
  mapElement: HTMLElement;
  public static userPosition = { lat: 0, lon: 0 };
  userId = null;
  database: SQLiteObject;

  eventPage = EventPage;
  schedulePage = SchedulePage;
  likedEventPage = LikedEventPage;

  isDatabaseReady = false;
  areEventsLoaded = false;
  requireEventsToBeLoaded = false;
  isMapUpdateRequired = true;

  markers = null;
  userMarker = null;

  currentLoading = null;

  events = [
    // { event: { name: 'Orchestra', start: "10PM", price: "free", distance: "0.3", picture_url: "assets/img/event_icon.png" } },
    // { event: { name: 'Play', start: "11PM", price: "10€", distance: "0.5", picture_url: "assets/img/event_icon.png" } },
    // { event: { name: 'Conference', start: "5AM", price: "free", distance: "1.2", picture_url: "assets/img/event_icon.png" } }
  ];
  fullEvents = [];
  likedEvents = null;
  showLikedEvents = false;

  constructor(
    public navCtrl: NavController,
    public googleMaps: GoogleMaps,
    private http: HTTP,
    public platform: Platform,
    private sqlite: SQLite,
    private geolocation: Geolocation,
    private toastCtrl: ToastController,
    private storage: Storage,
    public loadingCtrl: LoadingController) {

  }

  ionViewWillEnter() {
    this.storage.get("likedEvents").then(result => {
      if (result != null) {
        this.likedEvents = result;
        if (this.likedEvents.length == 0) {
          this.showLikedEvents = false;
        } else {
          this.showLikedEvents = true;
        }
      } else {
        this.showLikedEvents = false;
        this.likedEvents = [];
      }
    });
  }

  presentLoadingDefault() {
    var loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    return loading;
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.database.executeSql('create table events('
            + 'type_of_event VARCHAR(32),'
            + 'start VARCHAR(32),'
            + 'duration_year INT,'
            + 'duration_month INT,'
            + 'duration_day INT,'
            + 'duration_hour INT,'
            + 'duration_minutes INT,'
            + 'lang VARCHAR(32),'
            + 'end VARCHAR(32),'
            + 'price FLOAT(5,2),'
            + 'description VARCHAR(3000),'
            + 'name VARCHAR(32),'
            + 'facebook_id INT,'
            + 'GPS_lat FLOAT(17,14),'
            + 'GPS_lon FLOAT(17,14),'
            + 'address VARCHAR(32),'
            + 'venue_id INT,'
            + 'venue_name VARCHAR(200),'
            + 'picture_url VARCHAR(200)'
            + ')', {})
            .then(() => console.log('Executed SQL'))
            .catch(e => console.log("Error detected " + e.message));
          this.isDatabaseReady = true;
          //this.storeEventsInDatabase(this.events);
          //this.getEventsFromDatabase(this.events);
        })
        .catch(e => console.log(e));
      this.currentLoading = this.presentLoadingDefault();
      this.http.get('http://52.56.35.31:8088/getData', {}, {})
        .then(data => {
          this.currentLoading.dismiss();
          var jsonData = JSON.parse(data.data);
          //alert(jsonData.length);
          this.fillEventList(jsonData);
          this.displayEventsOnMap();
        })
        .catch(error => {
          this.currentLoading.dismiss();
          //this.requireEventsToBeLoaded = true;
          //this.getEventsFromDatabase(this.events);
        });

      this.geolocation.getCurrentPosition().then((resp) => {
        HomePage.userPosition.lat = resp.coords.latitude;
        HomePage.userPosition.lon = resp.coords.longitude;
      }).catch((error) => {
        console.log('Error getting location', error.message);
      });

      let watch = this.geolocation.watchPosition();
      watch.subscribe((data) => {
        HomePage.userPosition.lat = data.coords.latitude;
        HomePage.userPosition.lon = data.coords.longitude;
        if (this.isMapUpdateRequired && HomePage.userPosition.lat != 0 && HomePage.userPosition.lon != 0) {
          this.updateMapCameraPosition();
          this.isMapUpdateRequired = false;
        }

      });

      this.loadMap();
    });


  }

  public fillEventList(jsonData) {
    this.events = new Array();
    if (jsonData.length == 0) {
      jsonData = [
        { "venue_id": 1, "venue_name": "Cité musicale de Metz", "type_of_event": "TODO", "start": "2017-10-25T10:00:00+0200", "duration_year": 1, "duration_month": 2, "duration_day": 0, "duration_hour": 0, "duration_minutes": 0, "views": [], "lang": "TODO", "end": "2017-10-27T11:30:00+0200", "price": 25, "description": "Pour les vacances de la Toussaint, le Centre Pompidou-Metz propose un stage de 3 jours pour les 8-12 ans en lien avec l'exposition d'architecture \"Japan-Ness\".\n\nL'atelier de l'artiste Vincent Broquaire propose d\u2019explorer l\u2019architecture des mus\u00e9es \u00e0 travers le b\u00e2timent du Centre Pompidou-Metz ainsi que certains \u00e9difices pr\u00e9sent\u00e9s dans Japan-Ness. M\u00e9canismes, formes organiques, personnages dans de dr\u00f4les d\u2019ascenseurs : le travail de Vincent Broquaire d\u00e9cortique l\u2019architecture et m\u00e9lange l'imaginaire, le scientifique, l'absurde et l'inattendu.\n\n\u00c0 partir de ces architectures inattendues, les enfants pourront \u00e0 leur tour imaginer l'architecture et le fonctionnement d'un mus\u00e9e, tout d\u2019abord en compl\u00e9tant les sch\u00e9mas de Vincent Broquaire, puis librement, en cr\u00e9ant un livret qu\u2019ils ram\u00e8neront \u00e0 la maison.\n\nTarif : 15\u20ac\nDur\u00e9e : 3 x 90 minutes\nMER. 25.10 + JEU. 26.10 + VEN. 27.10.17, de 10:00 \u00e0 11:30", "name": "Stage Architectomies [8-12 ans / vacances de la Toussaint]", "facebook_id": "824531944380629", "GPS": { "lat": 49.107988299011, "lon": 6.1811848399707 }, "likes": [], "address": "1 parvis des Droits de l'Homme, 57000, Metz, France", "picture_url": "https://scontent.xx.fbcdn.net/v/t31.0-0/p480x480/22424657_10159435578300123_2793622685410336547_o.jpg?oh=dcbe21fb27974339d619a8c5cac442b5&oe=5A6622D2" },
        //{ "venue_id": 2, "venue_name": "BAM", "type_of_event": "TODO", "start": "2017-10-22T16:00:00+0200", "duration_year": 0, "duration_month": 0,"duration_day": 1,"duration_hour": 0,"duration_minutes": 0, "views": [], "lang": "TODO", "end": "2017-10-22T16:45:00+0200", "price": 12, "description": "Cr\u00e9ateur d\u2019installations sonores et visuelles, Fuyuki Yamakawa d\u00e9veloppe parall\u00e8lement des performances en collaboration avec des artistes de disciplines tr\u00e8s diff\u00e9rentes : danse, mode, cin\u00e9ma, radio.\nSon \u0153uvre engag\u00e9e se teinte d\u2019une forte critique sociale depuis la catastrophe de Fukushima. Dans ses performances les plus connues, il reprend et amplifie le son des battements de son c\u0153ur avec un st\u00e9thoscope \u00e9lectronique. Ce dispositif d\u00e9clenche l\u2019allumage d\u2019une s\u00e9rie d\u2019ampoules qui oscillent en suivant ses battements. L\u2019artiste parvient \u00e0 moduler ce rythme gr\u00e2ce \u00e0 sa maitrise exceptionnelle d\u2019une technique vocale issue du chant mongol khoomei, caract\u00e9ris\u00e9e par l\u2019\u00e9mission simultan\u00e9e de deux sons.\n\n\u00c0 partir de 10 ans.\n\nEntr\u00e9e libre sur pr\u00e9sentation d\u2019un billet d\u2019acc\u00e8s aux expositions du jour, dans la limite des places disponibles.\n\nGratuit pour les titulaires du Pass-M et Pass-M jeunes, - de 26 ans, demandeurs d'emploi, allocataires RSA ou de l'aide sociale (sur pr\u00e9sentation d'un justificatif de - 6 mois), membres de la Maison des artistes, adh\u00e9rents du Centre Pompidou).", "name": "Performance musicale de Fuyuki Yamakawa [Evening #2]", "facebook_id": "1887608281568117", "GPS": { "lat": 49.107988299011, "lon": 6.1811848399707 }, "likes": [], "address": "1 parvis des Droits de l'Homme, 57000, Metz, France", "picture_url": "https://scontent.xx.fbcdn.net/v/t31.0-8/s720x720/22338750_10159427120330123_6032839780793330900_o.jpg?oh=a92e56228684f1d1b04eb6d457da6b26&oe=5A83071E" },
        //{ "venue_id": 3, "venue_name": "Arsenal", "likes": [], "start": "2017-10-22T14:30:00+0200", "type_of_event": "TODO", "views": [], "duration_year": 0, "duration_month": 0,"duration_day": 0,"duration_hour": 1,"duration_minutes": 30, "lang": "TODO", "picture_url": "https://scontent.xx.fbcdn.net/v/t31.0-8/s720x720/22179895_10159401312890123_2725534430868585804_o.jpg?oh=9d58d5b312ee4fababf17ffe551689ce&oe=5A6546CD", "price": 15, "description": "Kazuyo Sejima, architecte fondatrice de l'agence SANAA  et sc\u00e9nographe de l\u2019exposition \"Japanorama\", rencontre Yuko Hasegawa, commissaire de l\u2019exposition \"Japanorama\"\n\nL\u2019agence SANAA, fond\u00e9e par Kazuyo Sejima et Ryue Nishizawa en 1995, est l\u2019une des plus prestigieuses agences d\u2019architecture contemporaine au Japon mais aussi sur la sc\u00e8ne internationale. Prix Pritzker 2010, elle s\u2019est entre autres illustr\u00e9e par des r\u00e9alisations mus\u00e9ales majeures comme le New Museum de New York ou le Louvre-Lens. Pour l\u2019exposition \"Japanorama\", l\u2019agence SANAA a con\u00e7u une sc\u00e9nographie dans laquelle on retrouve sa signature : la transparence, le d\u00e9cloisonnement de l\u2019espace et la fluidit\u00e9 du parcours, permettant au visiteur de d\u00e9ambuler librement entre les \u0153uvres.\n\nLa rencontre se d\u00e9roulera en japonais et sera traduite en fran\u00e7ais.\nEntr\u00e9e libre sur pr\u00e9sentation d\u2019un billet d\u2019acc\u00e8s aux expositions du jour, dans la limite des places disponibles.", "name": "Rencontre entre Kazuyo Sejima et Yuko Hasegawa [Evening n\u00b02]", "facebook_id": "2397921047100159", "GPS": { "lat": 49.107988299011, "lon": 6.1811848399707 }, "end": null, "address": "1 parvis des Droits de l'Homme, 57000, Metz, France" }
      ];
    }
    var iterations = 3;
    if (jsonData.length < 3) {
      iterations = jsonData.length;
    }
    for (var i = 0; i < iterations; i++) {
      var currentEvent = jsonData[i];

      if (currentEvent != null) {
        if (currentEvent.price == null) {
          currentEvent.price = 0;
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
    for (var i = 0; i < jsonData.length; i++) {
      var currentEvent = jsonData[i];
      if (currentEvent != null) {
        if (currentEvent.price == null) {
          currentEvent.price = 0;
        }
        this.fullEvents.push(currentEvent);
      }
    }
    this.areEventsLoaded = true;
    this.storeEventsInDatabase(this.fullEvents);
  }

  storeEventsInDatabase(events) {
    if (this.isDatabaseReady && this.areEventsLoaded) {
      this.database.transaction(function (tx) {
        events.forEach(event => {
          if (event.facebook_id != undefined) {
            tx.executeSql('SELECT count(*) AS count FROM events WHERE facebook_id=' + event.facebook_id, [], function (tx, rs) {
              if (rs.rows.item(0).count == 0) {
                tx.executeSql('insert into events VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                  [event.type_of_event,
                  event.start,
                  event.duration_year,
                  event.duration_month,
                  event.duration_day,
                  event.duration_hour,
                  event.duration_minutes,
                  event.lang,
                  event.end,
                  event.price,
                  event.description,
                  event.name,
                  event.facebook_id,
                  event.GPS_lat,
                  event.GPS_lon,
                  event.address,
                  event.venue.id,
                  event.venue.name,
                  event.picture_url
                  ]);
              }
            }, function (tx, error) {
              console.log('SELECT error: ' + error.message);
            });
          }
        });
      });
    }
  }

  getEventsFromDatabase(events) {
    var newEvents;
    if (this.isDatabaseReady && this.requireEventsToBeLoaded) {
      this.database.transaction(function (tx) {

        tx.executeSql('SELECT * FROM events;', [], function (tx, rs) {
          events = new Array();
          for (var i = 0; i < rs.rows.length; i++) {
            var element = rs.rows.item(i);
            events.push({
              "type_of_event": element.type_of_event,
              "start": element.start,
              "duration_year": element.duration_year,
              "duration_month": element.duration_month,
              "duration_day": element.duration_day,
              "duration_hour": element.duration_hour,
              "duration_minutes": element.duration_minutes,
              "lang": element.lang,
              "end": element.end,
              "price": element.price,
              "description": element.description,
              "name": element.name,
              "facebook_id": element.facebook_id,
              "GPS_lat": element.gps_lat,
              "GPS_lon": element.gps_lon,
              "address": element.address,
              "venue_id": element.venue_id,
              "venue_name": element.venue_name,
              "picture_url": element.picture_url
            }
            );
          }
          newEvents = [];
          events.forEach(element => {
            newEvents.push(element);
          });
        }, function (tx, error) {
          console.log('SELECT error: ' + error.message);
        });
      }).then(() => {
        this.fillEventList(newEvents);
        this.displayEventsOnMap();
      });
    }

  }

  loadMap() {
    this.mapElement = document.getElementById('map');

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: HomePage.userPosition.lat,
          lng: HomePage.userPosition.lon
        },
        zoom: 12,
        tilt: 30
      }
    };

    this.map = new GoogleMap(this.mapElement, mapOptions);
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        this.isMapLoaded = true;
        this.map.setCameraTarget({
          lat: HomePage.userPosition.lat,
          lng: HomePage.userPosition.lon
        });
        this.createUserMarker();
      });
  }

  updateMapCameraPosition() {
    this.map.setCameraTarget({
      lat: HomePage.userPosition.lat,
      lng: HomePage.userPosition.lon
    });
    this.createUserMarker();
  }

  createUserMarker() {
    this.map.addMarker({
      icon: {
        'url': "assets/img/userPosition.png",
        'size': {
          'width': 15,
          'height': 15
        }
      },
      position: {
        lat: HomePage.userPosition.lat,
        lng: HomePage.userPosition.lon
      }
    }).then(marker => {
      marker.on(GoogleMapsEvent.MARKER_CLICK)
        .subscribe(() => {
          alert('clicked');
        });
    });
  }

  displayEventsOnMap() {
    // add a marker for each event on the map
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        this.isMapLoaded = true;
        this.displayMarkers();
      });
    if (this.isMapLoaded) {
      this.displayMarkers();
    }
  }

  displayMarkers() {
    this.markers = new Array();
    for (var i = 0; i < this.fullEvents.length; i++) {
      var event = this.fullEvents[i];
      var currentMarker = this.map.addMarker({
        title: event.name,
        icon: 'red',
        animation: 'DROP',
        position: {
          lat: event.GPS_lat,
          lng: event.GPS_lon
        }
      }).then(marker => {
        marker.on(GoogleMapsEvent.MARKER_CLICK)
          .subscribe(() => {
            alert('clicked');
          });
      });
      this.markers.push(currentMarker);
    }
    for (var i = 0; i < this.markers.length; i++) {

      var marker = this.markers[i];
      marker.on(GoogleMapsEvent.MARKER_CLICK)
        .subscribe(() => {
          this.presentToast("clicked")
        });

    }
  }

  eventSelected(event) {
    this.selectedEvent = event;
    this.navCtrl.push(EventPage, { event: event });
    this.checkUserId(this.sendPostWithId);
  }

  goToProfilePage() {
    this.navCtrl.push(ProfilePage);
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