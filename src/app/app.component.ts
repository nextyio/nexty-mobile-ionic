import { Component, ViewChild } from '@angular/core';
import { AlertController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { UnloginPage } from "../pages/unlogin/unlogin";
import { SettingPage } from "../pages/setting/setting";
import { AboutPage } from "../pages/about/about";
import { AuthService } from "../services/auth.service";
import { DataService } from '../services/data.service';
import { LoadingService } from '../services/loading.service';
import { Network } from '@ionic-native/network';
import { RedeemPage } from '../pages/redeem/redeem';
import { tap } from 'rxjs/operators';
import { ToastController } from 'ionic-angular';
import { FcmService } from '../services/fcm.service';
import { BarcodeScanner, BarcodeScanResult } from '@ionic-native/barcode-scanner';
import { PrivateKeyPage } from '../pages/private-key/private-key';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  activePage: number = 1;

  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    private authService: AuthService,
    private dataservice: DataService,
    private loadingservice: LoadingService,
    private network: Network,
    private fcm: FcmService,
    private toastCtrl: ToastController,
    private barcodeScanner: BarcodeScanner,

  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log("platform ready..")
      this.splashScreen.hide();
      if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString('#737373');
      }
      this.authService.initAuth().finally(() => {
        this.checkAuth();
        this.splashScreen.hide();
      }).subscribe();

      // Check connect internet
      this.network.onDisconnect().subscribe(disconnect => {
        this.loadingservice.ToastNet();
        console.log('disconnect network');
      })
      this.network.onConnect().subscribe(connect => {
        this.loadingservice.hideNet();
        console.log('connect network');
      })
      this.network.onchange().subscribe((net: Network) => {
        console.log('type:', net.type)
        if (net.type == 'online') {
          this.loadingservice.hideNet();
        }
      })
      // Listen to incoming messages
      this.fcm.listenToNotifications().pipe(
        tap(msg => {
          console.log("msg: ", msg);
          // show a toast
          const toast = this.toastCtrl.create({
            message: msg.body,
            duration: 3000
          });
          toast.present();
        })
      )
        .subscribe()
      // get token
      this.fcm.getToken().then(token => {
        console.log("token device: " + token);
      })
    });
  }

  checkAuth() {
    if (this.authService.isAuth) {
      this.goHome();
    } else {
      this.nav.setRoot(UnloginPage);
    }
  }

  getPrivateKey() {
    this.nav.setRoot(PrivateKeyPage)
    this.activePage = 5;
  }

  goHome() {
    this.nav.setRoot(HomePage);
    this.activePage = 1;
  }

  goSetting() {
    this.nav.setRoot(SettingPage);
    this.activePage = 2;
  }

  goAbout() {
    this.nav.setRoot(AboutPage);
    this.activePage = 3;
  }

  Redeem() {
    this.loadingservice.show();
    this.barcodeScanner.scan().then((result: BarcodeScanResult) => {
      this.loadingservice.hide()
      if (!result.cancelled) {
        try {
          this.nav.push(RedeemPage, result.text)

          // this.http.post("", body).map(res => {

          // }), (err) => {
          //   console.log(err);
          // }
        } catch (error) {
          console.log(error)
        }

      }
    })
  }

  showConfirmLogout() {
    let confirm = this.alertCtrl.create({
      title: 'Do you want to logout?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.logout();
          }
        }
      ]
    });
    confirm.present();
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.nav.setRoot(UnloginPage);
    })
  }
  clearCache() {
    this.dataservice.clearBackup();
  }
}
