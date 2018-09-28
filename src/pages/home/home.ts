import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { SendPage } from "../send/send";
import { DashboardPage } from "../dashboard/dashboard";
import { RequestPage } from "../request/request";
import { LoadingService } from '../../services/loading.service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tabIndex: number = 1;
  sendPage = SendPage;
  dashboardPage = DashboardPage;
  requestPage = RequestPage;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private loadingService: LoadingService,
  ) {
    this.loadingService.logined = true;
    if (this.loadingService.DataDeepLink.length > 0) {
      this.tabIndex = 0;
    }
  }
}
