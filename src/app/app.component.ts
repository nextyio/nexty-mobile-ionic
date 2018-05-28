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

      console.log('speed internet: ' + this.network.downlinkMax)

    });
  }

  checkAuth() {
    if (this.authService.isAuth) {
      this.goHome();
    } else {
      this.nav.setRoot(UnloginPage);
    }
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
