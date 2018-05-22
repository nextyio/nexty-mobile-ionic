import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DashboardService } from "./dashboard.service";
import { HistoryPage } from "../history/history";
import { RateService } from "../../services/rate.service";
import { WalletService } from "../../services/wallet.service";
import { Constants } from "../../helper/constants";
import { Utils } from "../../helper/utils";
import { DataService } from '../../services/data.service';
import { BackupPage } from '../backup/backup';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage implements OnDestroy {

  lineChartData: Array<any> = [{}];
  public checkBackup: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private rateService: RateService,
    private walletService: WalletService,
    private service: DashboardService,
    private dataservice: DataService
  ) {
    this.rateService.rateHistoryUpdated.subscribe(() => this.updateGraph());

    this.service.load();
  }

  ionViewDidLoad() {
    // start recurring
    this.rateService.startRateHistoryRecurring();
    this.rateService.startRateRecurring();
    this.walletService.startBalanceRecurring();
  }
  ionViewDidEnter() {
    this.dataservice.getBackup().subscribe(data => {
      console.log("data backuped" + JSON.stringify(data));
      if (data == null) {
        console.log('user has not yet back up')
        this.checkBackup = true;
      }
      else {
        console.log("user has backup");
        this.checkBackup = false;
      }
    })
  }
  goBackup() {
    this.navCtrl.push(BackupPage);
  }
  ngOnDestroy(): void {
    // stop recurring
    this.rateService.stopRateHistoryRecurring();
    this.rateService.stopRateRecurring();
    this.walletService.stopBalanceRecurring();
  }

  get lastRatePrefix(): string {
    return Utils.round(this.rateService.rate / Constants.PNTY_NTY, 8).toString().substr(0, 6);
  }

  get lastRateSuffix(): string {
    return Utils.round(this.rateService.rate / Constants.PNTY_NTY, 8).toString().substr(6);
  }

  get balance(): number {
    return Math.round(this.walletService.balance / Constants.BASE_NTY);
  }

  updateGraph() {
    let data = [];
    for (let entry of this.rateService.rateHistory) {
      data.push({
        x: entry.date,
        y: entry.price
      });
    }

    this.lineChartData = [
      { data: data, fill: false, lineTension: 0 } //Removed when Listed on Exchange
    ];
  }

  public lineChartOptions: any = {
    responsive: true,
    scales: {
      xAxes: [{
        type: "time",
        distribution: 'linear',
        scaleLabel: {
          display: false
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true
        },
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  public lineChartColors: Array<any> = [
    { // blue
      borderColor: 'rgb(27, 131, 249)',
    }
  ];

  goHistory(): void {
    this.navCtrl.push(HistoryPage);
  }
}
