import { LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class LoadingService {
  loading: any;

  constructor(private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
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
}
