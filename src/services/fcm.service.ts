import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
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
}
