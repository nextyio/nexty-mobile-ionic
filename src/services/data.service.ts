import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/observable/forkJoin";

@Injectable()
export class DataService {
  constructor(private storage: Storage, ) {
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
  setToken(token: any): Observable<any> {
    return Observable.fromPromise(this.storage.set('listToken', token).then(value => {
      return value;
    }))
  }

  getToken(): Observable<any> {
    return Observable.fromPromise(this.storage.get('listToken')).map(value => {
      return value;
    })
  }

  getvalue(name: string): Observable<any> {
    return Observable.fromPromise(this.storage.get(name)).map(value => {
      return value;
    })
  }

  clearBackup() {
    return Observable.forkJoin(
      this.storage.remove('listToken'),
      this.storage.remove('keystore')
    );
  }

}
