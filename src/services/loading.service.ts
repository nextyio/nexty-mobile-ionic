import { LoadingController, AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';


@Injectable()
export class LoadingService {
  loading: any;
  toastNet: any;

  public DataDeepLink: string = '';
  public logined: boolean = false;
  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private loadingBar: SlimLoadingBarService,
    private alertCtrl: AlertController
  ) {
  }

  show() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  showToat(message: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  hide() {
    this.loading.dismiss();
  }

  ToastNet() {
    this.toastNet = this.toastCtrl.create({
      message: 'Please connect internet',
      cssClass: 'toastNetwork'
    });
    this.toastNet.present();
  }
  hideNet() {
    this.toastNet.dismiss();
  }
  showLoading() {
    this.loadingBar.start();
    this.loadingBar.color = 'red';
    // this.loadingBar.height = '10px';
  }
  hideloading() {
    this.loadingBar.complete();
  }

  alert(errMsg) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      message: errMsg,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }
}
