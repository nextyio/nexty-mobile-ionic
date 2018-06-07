import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HistoryService } from "./history.service";
import { TransactionDetailPage } from "../detail/detail";
import { LoadingService } from "../../services/loading.service";
import { AuthService } from "../../services/auth.service";
import { HistoryModel } from "./history.model";

/**
 * Generated class for the HistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

const length = 20;

@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})

export class HistoryPage {
  transactions: Transaction[];
  index: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private loadingService: LoadingService,
    private authService: AuthService,
    private service: HistoryService) {
  }

  ionViewDidLoad() {
    this.loadingService.showLoading();
    this.service.getData().finally(() => {
      this.loadingService.hideloading();
    }).subscribe(() => {
      this.transactions = this.getFullTransaction();
      this.index = this.transactions.length;
    });
  }


  getItems(ev) {
    // Reset items back to all of the items
    this.transactions = this.getFullTransaction();

    // set val to the value of the ev target
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.transactions = this.transactions.filter((transaction) => {
        return (transaction.quantity.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  getFullTransaction(): Transaction[] {
    let transactions = [];
    for (let entry of this.service.historyData) {
      let type = 'up';
      if (entry.to == this.authService.address) {
        type = 'down';
      }
      let transaction = new Transaction();
      transaction.tx = entry.tx;
      transaction.type = type;
      transaction.quantity = entry.value + "NTY";
      transaction.datetime = entry.time.format("YYYY-MM-DD HH:mm:ss");
      transaction.data = entry;

      transactions.push(transaction);
    }
    return transactions;
  }

  goDetail(transaction: Transaction) {
    console.log(JSON.stringify(transaction))
    this.navCtrl.push(TransactionDetailPage, { data: transaction.data, time: transaction.datetime });
  }

  doInfinite(infiniteScroll) {
    this.service.getData(this.index, length).finally(() => {
    }).subscribe(() => {
      this.transactions = this.getFullTransaction();
      this.index = this.transactions.length;
      infiniteScroll.complete();
    })
  }

  swipeEvent(e) {
    if (e.direction == '2') {
      this.navCtrl.parent.select(2);
    } else if (e.direction == '4') {
      this.navCtrl.parent.select(0);
    }
  }
}

export class Transaction {
  tx: string;
  type: string;
  quantity: string;
  datetime: string;
  data: HistoryModel;
}
