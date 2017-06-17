import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Create } from '../pages/create/create';
import { SignIn } from '../pages/signIn/signIn';
import { RoadMap } from '../pages/map/map';
import { UserPage } from '../pages/userPage/userPage';
import { GooglePlus } from '@ionic-native/google-plus';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { UserProvider } from '../providers/user/user';
import { File } from '@ionic-native/file';
import { IonicStorageModule } from '@ionic/storage';
import { ListPage } from '../pages/list/list';





@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Create,
    SignIn,
    RoadMap,
    UserPage,
    ListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
     IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Create,
    SignIn,
    RoadMap,
    UserPage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GooglePlus,
    GoogleMaps,
    Geolocation,
    RoadMap,
    UserProvider,
    File
  ]
})
export class AppModule {}
