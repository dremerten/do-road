import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  MenuController,
  ToastController,
  LoadingController,
  AlertController
} from "ionic-angular";
import { Storage } from "@ionic/storage";
import { RoadMap } from "../map/map";
import { Geolocation } from "@ionic-native/geolocation";
import { AngularFireAuth } from "angularfire2/auth";
import {
  AngularFireDatabase,
  FirebaseListObservable
} from "angularfire2/database";
import {DatabaseserviceProvider} from "../../providers/databaseservice/databaseservice";

declare var google, navigator;
//idle, intrip, request

@Component({
  selector: "page-list",
  templateUrl: "list.html"
})
export class ListPage {
  show: boolean = false;
  person;
  latLng;
  lat;
  long;
  user: any;
  empty = false;
  passengers: Array<any> = [];
  people : FirebaseListObservable<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menu: MenuController,
    public storage: Storage,
    public toastCtrl: ToastController,
    public load: LoadingController,
    public alertCtrl: AlertController,
    public auth: AngularFireAuth,
    public angularDB: AngularFireDatabase,
    public geolocation: Geolocation,
    public db: DatabaseserviceProvider
    ) {
    // If we navigated to this page, we will have an item available as a nav param
    menu.swipeEnable(false);

    //this.user = this.auth.auth.currentUser// temp
    this.auth.auth.onAuthStateChanged(user => {
      
      if (user != null) {
        this.people = this.db.publiclistAccounts();
        
      /**  this.user = user.uid;
        this.angularDB
        .list("/drivers/" + user.uid + "/requests", {
          preserveSnapshot: true
        })
        .subscribe(snapshots => {
          this.people = [];
          snapshots.forEach(snapshot => {
            console.log(snapshot.key, snapshot.val());
            let person = snapshot.val();
            person.key = snapshot.key;
            person.status= "body";
            this.angularDB.object("/passengers/" + snapshot.key).subscribe(result =>{
              person.name = result.name;
            }), error =>{ console.log(error);
              this.toasting(error.error + "....." + error)

            };
            this.people.push(person);
          }), error =>{ console.log(error)
          this.toasting(error.error + "....." + error)};;
        }), error =>{ console.log(error)
          this.toasting(error.error + "....." + error)};;*/
        
      }
    });

    //Checks if the app was exited before a trip was finished
    this.storage.get("previous").then(val => {
      if (val) {
        this.storage.get("trip").then(data => {
          this.previousTrip(data);
        });
      }
    });
  }

  //Selects or deselect a user to pickup on the next rip
  personTapped(event, person) {
    console.log(person.key, person.pickUpLat, person.pickUpLng);
    if (person.status == "body") {
      person.status = "car";
      this.passengers.push(person);
      //this.distTime(person)
      //this.passengers.sort(this.sortpeople);

      //this.alerts();
    } else {
      person.status = "body";
      this.removepassenger(person);
      if (this.passengers[0] == null) console.log("empty");
      else {
        this.passengers.sort(this.sortpeople);
      }
    }
  }

  //Removes user from list of approved passenger
  removepassenger(person) {
    var index = this.passengers.indexOf(person, 0);
    if (index > -1) {
      this.passengers.splice(index, 1);
    }
  }

  //When a user request has been accepted they are removed from the request list
  /** removePerson(person) {
    var index = this.people.indexOf(person, 0);
    if (index > -1) {
      this.people.splice(index, 1);
    }
  }*/

  //Sorts list by passengers distance from driver
  sortpeople(pass1, pass2) {
    if (pass1.distance < pass2.distance) return -1;
    if (pass1.distance == pass2.distance) return 0;
    if (pass1.distance > pass2.distance) return 1;
  }

  //Confirms selected users for the next trip
  confirm() {
    setTimeout(() => {
      this.toasting("Ready to go!");
      let decision = this.passengers;
      this.passengers.forEach(person => {
        this.angularDB.object('/drivers/'+this.user+'/requests/'+person.key).update({status:'Accept'})
      });
      this.passengers = [];
      this.storage.set("previous", true);
      this.storage.set("trip", decision);
      this.navCtrl.push(RoadMap, { passengers: decision });
    }, 500);
  }

  toasting(content) {
    let toast = this.toastCtrl.create({
      message: content,
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  //Continues previous trip
  previousTrip(data) {
    let confirm = this.alertCtrl.create({
      title: "Previous Trip?",
      message:
      "A previous trip has been detected. Would you like to continue it?",
      buttons: [
      {
        text: "Yes",
        handler: () => {
          this.navCtrl.push(RoadMap, { passengers: data });
          console.log("Disagree clicked");
        }
      },
      {
        text: "No",
        handler: () => {
          this.storage.set("previous", false);
          console.log("No");
        }
      }
      ]
    });
    confirm.present();
  }

  //Sets data to be displayed for a person's detail
  details(event, person) {
    this.show = true;
    this.person = person;
  }

  //Toggles visibilty of card showing user information
  invisible() {
    this.show = false;
  }

  locate() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.latLng = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
          );
        let data = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        this.angularDB.object("/drivers/" + this.user.uid).update(data);
      },
      err => {
        console.log(err);
      }
      );
  }

  distTime(passenger) {
    let service = new google.maps.DistanceMatrixService();
    this.locate();
    let lt = 0 + passenger.pickUpLat;
    let lg = 0 + passenger.pickUpLng;
    console.log(lt, lg);
    service.getDistanceMatrix(
    {
      origins: [this.latLng],
      destinations: [
      new google.maps.LatLng(18.05, -76.5 )
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
}
