import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { SocialSharing } from "@ionic-native/social-sharing";
import { AuthService } from "../../services/auth.service";
import { Clipboard } from '@ionic-native/clipboard';

/**
 * Generated class for the RequestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-request',
  templateUrl: 'request.html',
})
export class RequestPage {

  address: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private authService: AuthService,
    private socialSharing: SocialSharing,
    private clipboard: Clipboard
  ) {
  }

  ionViewDidLoad() {
    this.address = this.authService.address;
  }

  share() {
    let options = {
      message: this.address,
      chooserTitle: 'Share via...'
    };
    this.socialSharing.shareWithOptions(options);
  }

  onClickAddress() {
    this.clipboard.copy(this.address);
    this.showMsg(this.toastCtrl)
  }

  showMsg(toastCtrl: ToastController) {
    let toast = toastCtrl.create({
      message: 'Copied to clipboard',
      duration: 3000,
    });
    toast.present();
  }
}
