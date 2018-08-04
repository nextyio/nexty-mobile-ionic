import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/throw';
/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmService {

  constructor(
    public http: HttpClient,
    public firebaseNative: Firebase,
    public platform: Platform
  ) {
    console.log('Hello FcmProvider Provider');
    this.showAddToken();
  }
  async getToken() {
    let token;
    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken()
    }

    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    }

    return token;
  }
  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen()
  }
  showAddToken(): Observable<any> {
    return this.http.get("https://api.nexty.io/api/wallet/showtoken")
      .map(data => {
        return Observable.of(data)
      })
      .catch((error: Response) => {
        console.log(error)
        return Observable.of(false)
      })
  }
}
