import {Component} from '@angular/core';
import {MenuController, NavController, NavParams} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {RegisterPage} from "../register/register";
import {RestorePage} from "../restore/restore";

@Component({
  selector: 'page-unlogin',
  templateUrl: 'unlogin.html',
})
export class UnloginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private menuCtrl: MenuController) {
    // disable menu
    this.menuCtrl.enable(false, 'main-menu');
  }

  login() {
    this.navCtrl.push(LoginPage);
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  restore() {
    this.navCtrl.push(RestorePage);
  }
}
