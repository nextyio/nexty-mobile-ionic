import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { DashboardService } from "./dashboard.service";
import { HistoryPage } from "../history/history";
import { RateService } from "../../services/rate.service";
import { WalletService } from "../../services/wallet.service";
import { Constants } from "../../helper/constants";
import { Utils } from "../../helper/utils";
import { DataService } from '../../services/data.service';
import { BackupPage } from '../backup/backup';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import { Network } from '@ionic-native/network';
declare var CanvasJS;

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
  public toastNet;
  public datachart
  public typeChart = [{ "Title": "Day", "Value": "D" }, { "Title": "Week", "Value": "W" }, { "Title": "All", "Value": "ALL" }]
  public TimeOut: boolean = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private rateService: RateService,
    private walletService: WalletService,
    private service: DashboardService,
    private dataservice: DataService,
    private platform: Platform,
    public http: HttpClient,
    private network: Network,
  ) {
    this.rateService.rateHistoryUpdated.subscribe(() => this.updateGraph());
    this.service.load();

  }

  ionViewDidLoad() {
    // start recurring
    this.rateService.startRateHistoryRecurring();
    this.rateService.startRateRecurring();
    this.walletService.startBalanceRecurring();
    // this.loadchart();
    this.network.onchange().subscribe((net: Network) => {
      console.log('type:', net.type)
      console.log('check net:', net);
      this.getDataChart('W');
    })

    var selector, elems, makeActive;
    selector = '.ul-typeChart li';
    elems = document.querySelectorAll(selector);
    elems[1].classList.add('activee')
    makeActive = function () {
      for (var i = 0; i < elems.length; i++) {
        elems[i].classList.remove('activee');
      }
      this.classList.add('activee');
    };

    for (var i = 0; i < elems.length; i++) {
      elems[i].addEventListener('mousedown', makeActive);
    }
  }



  getDataChart(type) {
    document.getElementById('loading').style.display = 'block';
    var time = new Date;
    var url = '';
    switch (type) {
      case 'D': {
        url = Constants.COINMARKETCAP + (time.getTime() - Constants.DAY) + '/' + time.getTime() + '/'
      }
        break;
      case 'W': {
        url = Constants.COINMARKETCAP + (time.getTime() - Constants.WEEK) + '/' + time.getTime() + '/'
      }
        break;
      default: {
        url = Constants.COINMARKETCAP
      }
        break;
    }
    this.http.get(url).timeout(5000)
      .subscribe(res => {
        this.TimeOut = false
        this.datachart = res;
        // console.log('Get data chart success: ', this.datachart);
        this.loadchart();
      })
    setTimeout(() => {
      if (this.TimeOut == true) {
        console.log()
      }
    }, 5000);
  }


  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.getDataChart('W');
    })
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
    // return Utils.round(this.rateService.rate / Constants.PNTY_NTY, 8).toString().substr(0, 6);
    return (this.rateService.rate).toFixed(6)
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
  loadchart() {
    document.getElementById('loading').style.display = 'block';
    var dataPoints1 = [];
    var dataPoints2 = [];

    var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "light2", // "light1", "light2", "dark1", "dark2"
      // zoomEnabled: true,
      title: {
        text: "Nexty Exchange Rate"
      },
      // subtitles: [{
      //   text: "(Will be update when NTY is listed on Exchange)"
      // }],
      axisY: {
        prefix: "$",
        includeZero: false,
        viewportMinimum: 1e-8,
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        fontColor: "dimGrey",
        itemclick: toggleDataSeries
      },
      data: [{
        type: "line",
        xValueType: "dateTime",
        yValueFormatString: "####.#########",
        xValueFormatString: "DDD, MMM DD YYYY, HH:mm:ss K",
        showInLegend: false,
        name: "Price(USD)",
        dataPoints: dataPoints1,
        // legendText: 'Price(USD)'
      },
      {
        type: "line",
        xValueType: "dateTime",
        yValueFormatString: "####.#########",
        showInLegend: false,
        name: "Price(BTC)",
        dataPoints: dataPoints2,
        // legendText: 'Price(BTC)'
      }]
    });

    function toggleDataSeries(e) {
      if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      }
      else {
        e.dataSeries.visible = true;
      }
      chart.render();
    }
    chart.render();

    let that = this;
    function updateChart() {
      that.datachart['price_usd'].forEach(x => {
        dataPoints1.push({
          x: x[0],
          y: x[1].toFixed(8) * 1e0
        })
      });
      that.datachart['price_btc'].forEach(x => {
        dataPoints2.push({
          x: x[0],
          y: x[1].toFixed(8) * 1e0
        })
      });

      chart.render();
      document.getElementById('loading').style.display = "none";
      // that.http.get('https://graphs2.coinmarketcap.com/currencies/nexty/1526543365000/1527148165000/')
      //   .subscribe(data => {
      //     data['price_btc'].forEach(x => {
      //       // console.log(JSON.stringify(x[1]))
      //       dataPoints2.push({
      //         x: x[0],
      //         y: x[1].toFixed(8) * 1e3
      //       })
      //       chart.render();
      //     })
      //     data['price_usd'].forEach(x => {
      //       // console.log(JSON.stringify(x[1]))
      //       dataPoints1.push({
      //         x: x[0],
      //         y: x[1].toFixed(10) * 1e1
      //       })
      //       chart.render();
      //       document.getElementById('loading').style.display = "none";
      //     })
      //   })
    }
    updateChart();
  }
}
