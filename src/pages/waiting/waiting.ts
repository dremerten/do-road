import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, ToastController, LoadingController, IonicPage} from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the WaitingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-waiting',
  templateUrl: 'waiting.html',
})
export class WaitingPage {
  latLng;
  none=true;
  passengers: Array<{name:string, distance: string, time: string, id: string, status:string}>;
  people = [{name:'Yuki', distance: 5, time: '15 mins', id: '43455654', status:'body', lat: 18.004, long: -76.856},{name:'Mira', distance: 2, time: '5 mins', id: '4929433', status:'body', lat: 18.0032, long: -76.7452},{name:'Jace', distance: 13, time: '53 min', id: '3433434', status:'body', lat:18.0187, long: -76.7445},{name:'Suna', distance: '74', time: '1 hr 13 mins', id: '5342545', status:'body', lat: 17.9422, long: -77.2333},{name:'Hugh', distance: 0.7, time: '2 mins', id: '43434641', status:'body', lat: 18.0213, long: -76.7692}];
  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController, public storage: Storage, public toastCtrl: ToastController, public load: LoadingController) {
    // If we navigated to this page, we will have an item available as a nav param
    menu.swipeEnable(false);
    this.empty();
    this.people.sort(this.sortpeople);
    // Let's populate this page with some filler content for funzies
    this.passengers = [];

    
    //this.storage.set('Travelling',this.passengers);
    /**for (let i = 1; i < 11; i++) {
      this.passengers.push({
        name: 'Person ' + i,
        distance: i + "km",
        time: '1hr',
        id: '0000',
        status: 'body'
      });
    }*/
  }

  empty(){
  	if(this.people.length>0)
    	this.none=false;
    else
    	this.none =true;
  }

  personTapped(event, person) {


    if(person.status == 'body'){
      person.status = 'car';
      this.passengers.push(person);
      console.log(this.passengers[0].distance);
      
      //this.alerts();
    }
    else{
      person.status = 'body';
      this.removepassenger(person);
      if (this.passengers[0] == null)
        console.log('empty')
      else{
        this.passengers.sort(this.sortpeople);
        console.log(this.passengers[0].distance);
      }
      

    }

  }

  removepassenger(person){
    var index = this.passengers.indexOf(person,0);
    if (index > -1){
      this.passengers.splice(index,1);
    }
  }

  removePerson(person){
    var index = this.people.indexOf(person,0);
    if (index > -1){
      this.people.splice(index,1);
    }
  }


  sortpeople(pass1, pass2){
    if (pass1.distance<pass2.distance)
      return -1;
    if (pass1.distance==pass2.distance)
      return 0;
    if (pass1.distance>pass2.distance)
      return 1;
  }

  confirm(){
    for (let x =0; x < this.passengers.length; x++){
    	this.removePerson(this.passengers[x]);
    }
    this.passengers = [];
    this.empty()

  }

  toasting(content){
    let toast = this.toastCtrl.create({
      message: content,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

 
}