import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { SendPage } from "../send/send";
import { DashboardPage } from "../dashboard/dashboard";
import { RequestPage } from "../request/request";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  sendPage = SendPage;
  dashboardPage = DashboardPage;
  requestPage = RequestPage;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
  ) {

  }

}
