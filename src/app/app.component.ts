import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TranslateModule } from 'ng2-translate/ng2-translate';
import { TranslateService } from 'ng2-translate';
import { Globalization } from '@ionic-native/globalization';
import { defaultLanguage, availableLanguages, sysOptions } from './i18n.constants'


import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    translate: TranslateService, private globalization: Globalization) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      translate.setDefaultLang(defaultLanguage);
      if ((<any>window).cordova) {
       this.globalization.getPreferredLanguage().then(result => {
         var language = this.getSuitableLanguage(result.value);
         translate.use(language);
         sysOptions.systemLanguage = language;
       });
     }
     else {
       let browserLanguage = translate.getBrowserLang() || defaultLanguage;
       var language = this.getSuitableLanguage(browserLanguage);
       translate.use(language);
       sysOptions.systemLanguage = language;
     }
    });
  }

  getSuitableLanguage(language) {
		language = language.substring(0, 2).toLowerCase();
		return availableLanguages.some(x => x.code == language) ? language : defaultLanguage;
  }
}

