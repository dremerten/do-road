import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseObjectObservable,  FirebaseListObservable } from 'angularfire2/database';


/*
  Generated class for the DatabaseserviceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DatabaseserviceProvider {

     constructor(private af: AngularFireDatabase) {

   }

   publiclistAccounts(): FirebaseListObservable<any[]>{

      return this.af.list('drivers');

   }

}
