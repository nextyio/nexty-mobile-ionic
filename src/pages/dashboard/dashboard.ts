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
import { NotificationsPage } from '../notifications/notifications';
import { SmartContractPage } from '../smart-contract/smart-contract';
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
  public type_chart;
  lineChartData: Array<any> = [{}];
  public checkBackup: boolean;
  public toastNet;
  public datachart
  public typeChart = [{ "Title": "Day", "Value": "D" }, { "Title": "Week", "Value": "W" }, { "Title": "Month", "Value": "M" }, { "Title": "All", "Value": "ALL" }]
  public TimeOut: boolean = true;
  public List = []
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
    this.service.load();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad")
    // start recurring
    // this.rateService.startRateHistoryRecurring();
    this.rateService.startRateRecurring();
    this.walletService.startBalanceRecurring();
    // this.loadchart();
    this.network.onchange().subscribe((net: Network) => {
      console.log('type:', net.type)
      console.log('check net:', net);
      this.getDataChart('W');
    })
    this.loadArrayTokenFirst();
    this.selectTypeChart()

  }

  selectTypeChart() {
    console.log("run function")
    var selector, elems, makeActive;
    selector = '.listType .row .col-list';
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
    this.type_chart = type;
    console.log("type chart" + type)
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
      case 'M': {
        url = Constants.COINMARKETCAP + (time.getTime() - Constants.MONTH) + '/' + time.getTime() + '/'
      }
        break;
      default: {
        url = Constants.COINMARKETCAP
      }
        break;
    }
    try {
      this.http.get(url)
        .subscribe(res => {
          this.TimeOut = false
          this.datachart = res;
          // console.log('Get data chart success: ', this.datachart);
          this.loadchart();
        })
    } catch (error) {
      console.log('e' + error);
    }


  }


  ngAfterViewInit() {
    console.log("ngAfterViewInit")
    this.platform.ready().then(() => {
      this.getDataChart('W');
    })
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter")
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
    this.getArrayToken();

    setInterval(() => {
      this.dataservice.getToken().subscribe(token => {
        if (token != null) {
          var ListToken = [];
          ListToken = JSON.parse(token);
          for (let i = 0; i < ListToken.length; i++) {
            this.walletService.updateBalanceToken(ListToken[i].tokenAddress, ListToken[i].ABI)
              .subscribe(data => {
                ListToken[i]['balance'] = data;
                var d = new Date();
                var n = d.getSeconds();
                console.log("balance update" + data + '       [seconds: ' + n + ']')
              })
          }
          setTimeout(() => {
            // console.log('listToken: ' + JSON.stringify(ListToken))
            this.dataservice.setToken(JSON.stringify(ListToken)).subscribe(data => {
              var d = new Date();
              var n = d.getSeconds();
              console.log('update balance token success' + '      [seconds: ' + n + ']')
              //              console.log("storage: " + data)
              this.List = ListToken;
            }), err => {
              console.log('error ' + err);
            }

          }, 50000);

        }
      })

    }, 10000);
    if (this.type_chart == 'W') {
      var selector, elems, makeActive;
      selector = '.listType .row .col-list';
      elems = document.querySelectorAll(selector);
      elems[1].classList.add('activee')
    }
  }

  ionViewDidLeave() {
    console.log("ionViewDidLeave")
  }

  loadArrayTokenFirst() {
    console.log("load first")
    this.dataservice.getToken().subscribe(token => {
      if (token != null) {
        var ListToken = [];
        ListToken = JSON.parse(token);
        for (let i = 0; i < ListToken.length; i++) {
          this.walletService.updateBalanceToken(ListToken[i].tokenAddress, ListToken[i].ABI)
            .subscribe(data => {
              console.log(i)
              ListToken[i]['balance'] = data;
              var d = new Date();
              var n = d.getSeconds();
              console.log("balance update" + data + '       [seconds: ' + n + ']')
            })
        }
        setTimeout(() => {
          // console.log('listToken: ' + JSON.stringify(ListToken))
          this.dataservice.setToken(JSON.stringify(ListToken)).subscribe(data => {
            var d = new Date();
            var n = d.getSeconds();
            console.log('update balance token success' + '      [seconds: ' + n + ']')
            this.List = ListToken;
            //              console.log("storage: " + data)
          }), err => {
            console.log('error ' + err);
          }

        }, 5000);

      }
    })
  }

  getArrayToken() {
    this.List = [];
    this.dataservice.getToken().subscribe(token => {
      if (token != null) {
        var ListToken = JSON.parse(token);
        ListToken.forEach(element => {
          this.List.push({
            tokenAddress: element['tokenAddress'],
            balance: parseFloat(element['balance']),
            symbol: element['symbol'],
            decimal: element['decimal'],
            ABI: element['ABI']
          })
        });
      } else {
        this.List = []
      }
    })
  }

  goBackup() {
    this.navCtrl.push(BackupPage);
  }

  ngOnDestroy(): void {
    // stop recurring
    // this.rateService.stopRateHistoryRecurring();
    // this.rateService.stopRateRecurring();
    this.walletService.stopBalanceRecurring();
  }

  get ListContract() {
    return this.List;
  }

  get lastRatePrefix(): string {
    // return Utils.round(this.rateService.rate / Constants.PNTY_NTY, 8).toString().substr(0, 6);
    return (this.rateService.rate).toFixed(6)
  }

  get lastRateSuffix(): string {
    return Utils.round(this.rateService.rate / Constants.PNTY_NTY, 8).toString().substr(6);
  }

  get balance(): number {
    var a = parseFloat((this.walletService.balance / Constants.BASE_NTY).toFixed(3))
    return a;
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
    // var dataPoints2 = [];

    CanvasJS.addColorSet("greenShades",
      [//colorSet Array
        "#286bb7",
        "#ff7f00",
      ]);

    var chart = new CanvasJS.Chart("chartContainer", {
      colorSet: "greenShades",
      animationEnabled: true,
      animationDuration: 2000,
      // backgroundColor: "#F5FCFF",
      backgroundColor: "#0d47a1",
      theme: "dark2", // "light1", "light2", "dark1", "dark2"
      // zoomEnabled: true,
      // title: {
      //   text: "Nexty Exchange Rate"
      // },
      // subtitles: [{
      //   text: "(Will be update when NTY is listed on Exchange)"
      // }],
      axisY: {
        gridThickness: 0,
        // prefix: "$",
        // includeZero: false,
        // viewportMinimum: 1e-8,
        tickLength: 0,
        lineThickness: 0,
        labelFormatter: function () {
          return " ";
        }
      },
      axisX: {
        // gridDashType: "dotter",
        margin: -30,
        gridThickness: 0,
        tickLength: 0,
        lineThickness: 0,
        labelFormatter: function () {
          return " ";
        }
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
        type: "splineArea",
        fillOpacity: .3,
        xValueType: "dateTime",
        yValueFormatString: "####.#########",
        xValueFormatString: "DDD, MMM DD YYYY, HH:mm:ss K",
        showInLegend: false,
        name: "Price(USD)",
        dataPoints: dataPoints1,
      },
      ]
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
      chart.render();
      document.getElementById('loading').style.display = "none";
    }
    updateChart();
  }
  notification() {
    this.navCtrl.push(NotificationsPage)
  }
}
