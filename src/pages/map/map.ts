import { Component, ViewChild, ElementRef } from "@angular/core";
import { IonicPage } from "ionic-angular";
import {
  Navbar,
  NavController,
  ToastController,
  AlertController,
  NavParams
} from "ionic-angular";
import { Platform } from "ionic-angular";
import { Geolocation } from "@ionic-native/geolocation";
import { TextToSpeech } from "@ionic-native/text-to-speech";
import { Storage } from "@ionic/storage";
import {
  AngularFireDatabase,
  FirebaseListObservable
} from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";

declare var google, navigator;

@IonicPage()
@Component({
  selector: "page-map",
  templateUrl: "map.html"
})
export class RoadMap {
  @ViewChild("map") mapElement;
  @ViewChild("navbar") navBar: Navbar;
  map: any;
  directionsDisplay;
  directionsService = new google.maps.DirectionsService();
  dServe = new google.maps.DirectionsService();
  latLng;
  currentLatLng;
  direct;
  lat = "Place";
  lon;
  destination;
  waypoints = [];
  markerArray = [];
  stepDisplay;
  there = false;
  numberOfSteps;
  next;
  marker;
  myRoute;
  anonRoute;
  num;
  passengers;
  directResults;
  pickup;
  user;


  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public geolocation: Geolocation,
    public tts: TextToSpeech,
    public toastCtrl: ToastController,
    public storage: Storage,
    public alertCtrl: AlertController,
    public params: NavParams,
    public angularDB: AngularFireDatabase,
    public auth: AngularFireAuth
  ) {
    this.auth.auth.onAuthStateChanged(user => {
      if(user!=null)
        this.user = user
    })
    this.platform.ready().then(() => this.onPlatformReady());
  }

  private onPlatformReady(): void {}

  ionViewDidLoad() {
    this.navBar.backButtonClick = () => {
      this.back();
    };
    this.loadMap();
  }

  loadMap() {
    navigator.geolocation.getCurrentPosition(
      //gets latitude and longitude of driver
      position => {
        this.latLng = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        ); //Sets gps coordinates to variable
        this.currentLatLng = this.latLng;
        console.log(this.currentLatLng);
        console.log(
          "" + position.coords.longitude + ":..." + position.coords.latitude
        );
        let mapOptions = {
          center: this.currentLatLng,
          zoom: 15,
          mpTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.directionsDisplay = new google.maps.DirectionsRenderer();

        this.map = new google.maps.Map(
          this.mapElement.nativeElement,
          mapOptions
        ); //Initializes the map view
        this.directionsDisplay.setMap(this.map);
        this.directionsDisplay.setPanel(
          document.getElementById("directionsPanel")
        );
        this.stepDisplay = new google.maps.InfoWindow();
        let p = this.params.get("passengers"); //Loads selected passengers
        console.log(JSON.stringify(p[0]));
      },
      err => {
        console.log(err);
      }
    );
  }

  //Sets destination and waypoints of journey
  passenger() {
    this.pickup = true;
    this.passengers = this.params.get("passengers");
    let last = this.passengers.length - 1;
    this.destination = new google.maps.LatLng(
      this.passengers[last].pickUpLat,
      this.passengers[last].pickUpLng
    );

    for (let x = 0; x < last; x++) {
      this.waypoints.push({
        location: new google.maps.LatLng(
          this.passengers[x].pickUpLat,
          this.passengers[x].pickUpLng
        ),
        stopover: true
      });
    }

    this.calcRoute();
  }

  passengerDestination() {
    let last = this.passengers.length - 1;
    this.destination = new google.maps.LatLng(
      this.passengers[last].dropoffLat,
      this.passengers[last].dropoffLng
    );

    for (let x = 0; x < last; x++) {
      this.waypoints.push({
        location: new google.maps.LatLng(
          this.passengers[x].dropoffLat,
          this.passengers[x].dropoffLng
        ),
        stopover: true
      });
    }

    this.calcRoute();
  }

  //Calculate and display directions to destination on map
  calcRoute() {
    let request = {
      origin: this.latLng,
      destination: this.destination,
      waypoints: this.waypoints,
      provideRouteAlternatives: true,
      travelMode: "DRIVING",
      drivingOptions: {
        departureTime: new Date(),
        trafficModel: "pessimistic"
      },
      unitSystem: google.maps.UnitSystem.METRIC
    };
    this.directionsService.route(request, (result, status) => {
      if (status == "OK") {
        this.directionsDisplay.setDirections(result);
        this.directResults = result;
        this.showSteps(0);
      }
    });
  }

  //Gets time and distance to a passenger
  distTime(passenger) {
    let service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [this.latLng],
        destinations: [
          new google.maps.LatLng(
            this.passengers[passenger].pickUpLat,
            this.passengers[passenger].pickUpLng
          )
        ],
        travelMode: "DRIVING"
      },
      this.callback
    );
  }

  callback(response, status) {
    console.log(response.rows[0].elements[0].distance.text);
    console.log(response.rows[0].elements[0].duration.text);
  }

  //Loads steps for each leg of journey
  showSteps(passenger) {
    if (passenger >= this.passengers.length) {
      console.log("Finished");
      if (this.pickup) {
        this.pickup = false;
        this.passengerDestination();
      }
    } else {
      //Checks to see if each passenger has been picked up
      this.there = false; //Resets before each leg begins

      this.myRoute = this.directResults.routes[0].legs[passenger]; //Gets direction a leg of the journey
      this.numberOfSteps = this.myRoute.steps.length; //Gets number of steps in the directions for a leg of the journey

      this.next = this.numberOfSteps - 1;
      /** for (let i = 0; i < this.myRoute.steps.length; i++) {
    

       console.log(myRoute.steps[i].instructions)
       var marker = new google.maps.Marker({
          position: myRoute.steps[i].start_point,
          map: this.map
         });
         this.attachInstructionText(marker, myRoute.steps[i].instructions);
          this.markerArray[i] = marker;
      }
    }*/

      this.distTime(passenger);
      console.log(
        passenger +
          "Number" +
          this.removeHTML(this.myRoute.steps[0].instructions)
      );
      let sentence = this.removeHTML(this.myRoute.steps[0].instructions);
      this.tts.speak(sentence); //Gives direction as speech
      //this.tts.speak(this.myRoute.steps[0].instructions)
      //.then(() => console.log('Success'))
      //.catch((reason: any) => console.log(reason));
      this.track(passenger); //Tracks the driver during the journey
    }
    /**attachInstructionText(marker, text) {
  google.maps.event.addListener((marker) => {
    this.stepDisplay.setContent(text);
    this.stepDisplay.open(this.map, marker);
  });*/
  }

  //Adds marker to drivers current location
  addMarker() {
    this.marker = new google.maps.Marker({
      position: this.currentLatLng,
      map: this.map
    });
  }

  //Remove HTML tags from text from direction instructions
  removeHTML(sentence) {
    return sentence.replace(/<(?:.|\n)*?>/gm, "");
  }

  toasting(content) {
    let toast = this.toastCtrl.create({
      message: content,
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  //Track driver during pickup

  track(passenger) {
    this.addMarker();
    this.pos();
    this.directions(passenger);
  }

  //Loads directions for current leg of journey
  directions(passenger) {
    let dest = null;
    if (this.pickup){
      dest =  new google.maps.LatLng(this.passengers[passenger].pickUpLat,this.passengers[passenger].pickUpLng)
    }
    else
      dest =  new google.maps.LatLng(this.passengers[passenger].dropoffLat,this.passengers[passenger].dropoffLng)

    let request = {
      origin: this.currentLatLng,
      destination: dest,
      travelMode: "DRIVING",
      drivingOptions: {
        departureTime: new Date(),
        trafficModel: "pessimistic"
      },
      unitSystem: google.maps.UnitSystem.METRIC
    };
    this.dServe.route(request, (result, status) => {
      if (status == "OK") {
        this.steps(result, passenger);
      } else console.log(status);
      
    });
  }



  //Updates current location of driver
  pos() {
    navigator.geolocation.getCurrentPosition(
      position => {

        this.currentLatLng = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
           
        );
        let data = {latitude: position.coords.latitude, longitude: position.coords.longitude};
          this.angularDB.object('/drivers/'+this.user.uid).update(data);
      },
      err => {
        console.log(err);
      }
    );
  }

  //Checks when at a new step in current leg
  steps(results, passenger) {
    if (!results) console.log("No results");
    else {
      let routeSteps = results.routes[0].legs[0];
      let length = routeSteps.steps.length;
      if (length <= 1) {
        //Last step of leg
        let stepInfo = this.removeHTML(routeSteps.steps[0].instructions);
        console.log(stepInfo);
        this.tts.speak(stepInfo); //Direction as speech
        let n = passenger + 1;
        this.toasting("Stop number " + n);
        this.endOfLeg(passenger);
      } else if (length <= this.next) {
        //Checks if is time for the next step
        this.next = length - 1; //Tracks which number step is next;
        let stepInfo = this.removeHTML(routeSteps.steps[0].instructions);
        console.log(stepInfo);
        this.tts.speak(stepInfo);
        setTimeout(() => {
          if (!this.there) this.track(passenger); //Continues tracking with a time delay
        }, 5000);
      } else {
        setTimeout(() => {
          if (!this.there) {
            this.track(passenger);
            console.log("Checked");
          }
        }, 5000);
      }
    }
  }

  endOfLeg(passenger) {
    //Notifies user that they are at the last step of the leg
    let confirm = this.alertCtrl.create({
      title: "Pick up confirmation",
      message: "Confirm when passenger has been picked up",
      buttons: [
        {
          text: "Yes",
          handler: () => {
            this.there = true;
            this.showSteps(passenger + 1);
          }
        },
        {
          text: "No",
          handler: () => {
            console.log("No");
          }
        }
      ]
    });
    confirm.present(); //user confirms whether the passenger has been picked up
  }

  back() {
    //Ensures user confirms they want to end a trip to prevent accidentally termination
    let confirm = this.alertCtrl.create({
      title: "End Trip?",
      message: "Are you sure you would like to end this unfinished trip?",
      buttons: [
        {
          text: "Yes",
          handler: () => {
            this.storage.set("previous", false);
            console.log("Left");
            this.navCtrl.pop();
          }
        },
        {
          text: "No",
          handler: () => {
            console.log("Right");
          }
        }
      ]
    });
    confirm.present();
  }
}
