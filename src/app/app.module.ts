import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
import { Create } from "../pages/create/create";
import { SignIn } from "../pages/signIn/signIn";
import { RoadMap } from "../pages/map/map";
import { UserPage } from "../pages/userPage/userPage";
import { VehiclesPage } from "../pages/vehicles/vehicles";
import { VehicleViewPage } from "../pages/vehicle-view/vehicle-view";
import { PassengerMapPage } from "../pages/passenger-map/passenger-map";
import { WaitingPage } from "../pages/waiting/waiting";
import { AddVehiclePage } from "../pages/add-vehicle/add-vehicle";
import { CompletedTripsPage } from "../pages/completed-trips/completed-trips";
import { ReviewPage } from "../pages/review/review";
import { GooglePlus } from "@ionic-native/google-plus";
import { GoogleMaps } from "@ionic-native/google-maps";
import { Geolocation } from "@ionic-native/geolocation";
import { UserProvider } from "../providers/user/user";
import { File } from "@ionic-native/file";
import { IonicStorageModule } from "@ionic/storage";
import { ListPage } from "../pages/list/list";
import { AbsoluteDragDirective } from "../directives/absolute-drag/absolute-drag";
import { TextToSpeech } from "@ionic-native/text-to-speech";
import { BackgroundGeolocation } from "@ionic-native/background-geolocation";
import { NativeStorage } from "@ionic-native/native-storage";
import { HttpModule } from "@angular/http";
import { Network } from "@ionic-native/network";
import { Push } from "@ionic-native/push";
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { DatabaseserviceProvider } from '../providers/databaseservice/databaseservice';

export const firebaseConfig = {
   apiKey: "AIzaSyB1PE4qVbbm_M074r7NYEclphW_4hPG_X8",
    authDomain: "calico-doroad.firebaseapp.com",
    databaseURL: "https://calico-doroad.firebaseio.com",
    storageBucket: "calico-doroad.appspot.com",
    messagingSenderId: "552647789390"
    
   };

@NgModule({
    declarations: [
    MyApp,
    HomePage,
    Create,
    SignIn,
    RoadMap,
    UserPage,
    ListPage,
    VehiclesPage,
    AddVehiclePage,
    AbsoluteDragDirective,
    VehicleViewPage,
    PassengerMapPage,
    WaitingPage,
    CompletedTripsPage,
    ReviewPage
    ],
    imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
    MyApp,
    HomePage,
    Create,
    SignIn,
    RoadMap,
    UserPage,
    ListPage,
    VehiclesPage,
    AddVehiclePage,
    VehicleViewPage,
    PassengerMapPage,
    WaitingPage,
    CompletedTripsPage,
    ReviewPage
    ],
    providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    GoogleMaps,
    Geolocation,
    RoadMap,
    UserProvider,
    File,
    TextToSpeech,
    BackgroundGeolocation,
    NativeStorage,
    Network,
    Push,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DatabaseserviceProvider
    ]
})
export class AppModule {}
