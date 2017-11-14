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
import { HttpModule, Http } from '@angular/http';
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { TranslateLoader, TranslateStaticLoader } from 'ng2-translate/src/translate.service';
import { Globalization } from '@ionic-native/globalization';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { EventPage } from '../pages/event/event';
import { SchedulePage } from '../pages/schedule/schedule';
import { ProfilePage } from '../pages/profile/profile';
import { VenuePage } from '../pages/venue/venue';
import { ChartPage } from '../pages/chart/chart';
import { LikedEventPage } from '../pages/liked-event/liked-event';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EventPage,
    SchedulePage,
    ProfilePage,
    VenuePage,
    ChartPage,
    LikedEventPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    ChartsModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EventPage,
    SchedulePage,
    ProfilePage,
    VenuePage,
    ChartPage,
    LikedEventPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatePicker,
    GoogleMaps,
    HTTP,
    SQLite,
    Globalization,
    Geolocation,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {
}
