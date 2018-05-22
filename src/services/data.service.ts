import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/observable/forkJoin";
import { File } from '@ionic-native/file';
import { DateTime } from "ionic-angular";
declare var cordova: any;
@Injectable()
export class DataService {
  constructor(private storage: Storage, private file: File) {
  }

  setCurrent(address: string): Observable<void> {
    return Observable.fromPromise(this.storage.set('current', address));
  }

  getCurrent(): Observable<string> {
    return Observable.fromPromise(this.storage.get('current'));
  }

  removeCurrent(): Observable<string> {
    return Observable.fromPromise(this.storage.remove('current'));
  }

  setAuth(auth: boolean): Observable<void> {
    if (auth) {
      return Observable.fromPromise(this.storage.set('auth', 1));
    } else {
      return Observable.fromPromise(this.storage.remove('auth'));
    }
  }

  checkAuth(): Observable<boolean> {
    return Observable.fromPromise(this.storage.get('auth')).map((value) => {
      return (value == 1);
    });
  }

  addAddress(address: string, password: string, privateKey: string): Observable<any> {
    return Observable.forkJoin([
      Observable.fromPromise(this.storage.set(address, password)),
      Observable.fromPromise(this.storage.set('pk_' + address, privateKey)),
    ]);
  }

  getAddressPwd(address: string): Observable<string> {
    return Observable.fromPromise(this.storage.get(address));
  }

  getAddressPK(address: string): Observable<string> {
    return Observable.fromPromise(this.storage.get('pk_' + address));
  }
  setBackup(keystore: string): Observable<any> {
    return Observable.fromPromise(this.storage.set('keystore', keystore).then(value => {
      return value;
    }));
  }
  getBackup(): Observable<any> {
    return Observable.fromPromise(this.storage.get('keystore')).map(value => {
      return value;
    })
  }

  getvalue(name: string): Observable<any> {
    return Observable.fromPromise(this.storage.get(name)).map(value => {
      return value;
    })
  }

  clearBackup() {
    return Observable.fromPromise(this.storage.remove('keystore'));
  }

  writeFileLocal(content): Observable<any> {
    var dateTime = new Date();
    let name = 'backup-' + dateTime.getDate() + dateTime.getTime() + '.txt';
    return Observable.fromPromise(this.file.writeFile(this.file.externalDataDirectory, name, content).then(res => {
      console.log("write file success: " + JSON.stringify(res));
    }).catch(err => {
      console.log("Error", err);
    }))
  }
}