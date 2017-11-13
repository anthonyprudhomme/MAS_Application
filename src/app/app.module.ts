import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { GoogleMaps } from '@ionic-native/google-maps';
import { DatePicker } from '@ionic-native/date-picker';
import { HTTP } from '@ionic-native/http';
import { SQLite } from '@ionic-native/sqlite';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';
import { ChartsModule } from 'ng2-charts';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { EventPage } from '../pages/event/event';
import { SchedulePage } from '../pages/schedule/schedule';
import { ProfilePage } from '../pages/profile/profile';
import { VenuePage } from '../pages/venue/venue';
import { ChartPage } from '../pages/chart/chart';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EventPage,
    SchedulePage,
    ProfilePage,
    VenuePage,
    ChartPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EventPage,
    SchedulePage,
    ProfilePage,
    VenuePage,
    ChartPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatePicker,
    GoogleMaps,
    HTTP,
    SQLite,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
