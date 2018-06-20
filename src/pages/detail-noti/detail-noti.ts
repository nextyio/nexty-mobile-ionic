import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DetailNotiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-detail-noti',
  templateUrl: 'detail-noti.html',
})
export class DetailNotiPage {
  contentNoti: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.contentNoti = this.navParams.data
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailNotiPage');
    // this.contentNoti = this.navParams.data
    console.log(JSON.stringify(this.contentNoti));
  }

}
