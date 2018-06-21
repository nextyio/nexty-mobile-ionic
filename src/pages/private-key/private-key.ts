import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { LoadingService } from '../../services/loading.service';
import { AuthService } from '../../services/auth.service';
import { Clipboard } from '@ionic-native/clipboard';

/**
 * Generated class for the PrivateKeyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-private-key',
  templateUrl: 'private-key.html',
})
export class PrivateKeyPage {
  copied: boolean;
  PrivateKey: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private loadingService: LoadingService,
    private authService: AuthService,
    private clipboard: Clipboard,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrivateKeyPage');
    this.PrivateKey = '';
    this.copied = false;
  }
  getPK(): boolean {
    return !!this.PrivateKey;
  }

  getPrivateKey() {
    let alert = this.alertCtrl.create({
      title: 'Retrieve your private key',
      message: 'Enter your local passcode to process',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Local passcode',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Get',
          handler: (data) => {
            this.doGetprivateKey(data['password'])
          }
        }
      ]
    });
    alert.present();
  }
  doGetprivateKey(passcode: string) {
    // this.loadingService.showLoading();
    try {
      if (this.authService.getPrivateKey(passcode) == null || this.authService.getPrivateKey(passcode) == '') {
        let alert = this.alertCtrl.create({
          title: 'Get private key failed',
          message: 'Invalid local passcode',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Try again',
              handler: () => {
                this.getPrivateKey();
              }
            }
          ]
        });
        alert.present();

      } else {
        this.PrivateKey = this.authService.getPrivateKey(passcode);
      }
    } catch (error) {
      let alert = this.alertCtrl.create({
        title: 'Get private key failed',
        message: 'Invalid local passcode',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Try again',
            handler: () => {
              this.getPrivateKey();
            }
          }
        ]
      });
      alert.present();
    }

  }
  copy() {
    this.clipboard.copy(this.PrivateKey);
    this.copied = true;
  }
}  
