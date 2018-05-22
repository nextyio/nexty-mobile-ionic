import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {BackupPage} from "../backup/backup";

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private toastCtrl: ToastController) {
  }

  goBackup() {
    this.navCtrl.push(BackupPage);
  }

  showCommingSoon() {
    let toast = this.toastCtrl.create({
      message: 'This feature is coming soon',
      duration: 3000,
    });
    toast.present();
  }
}
