import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {HistoryModel} from "../history/history.model";
import {Constants} from "../../helper/constants";
import {AuthService} from "../../services/auth.service";
import {InAppBrowser} from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class TransactionDetailPage {

  data: HistoryModel;
  tx: string;
  down: boolean;
  from: string;
  to: string;
  quantity: number;
  datetime: string;
  confirmed: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private iab: InAppBrowser,
              private authService: AuthService) {
  }

  ionViewDidLoad() {
    this.getData();
  }

  getData() {
    this.data = this.navParams.get('data');

    this.tx = this.data.tx;
    this.from = this.data.from;
    this.to = this.data.to;
    this.down = (this.authService.address == this.to);
    this.quantity = this.data.value;
    this.datetime = this.data.time.format("YYYY-MM-DD HH:mm:ss");

    let timeNow = new Date().getTime();
    if (timeNow - this.data.time.utc().valueOf() < Constants.CONFIRM_DELAY) {
      this.confirmed = false;
    } else {
      this.confirmed = true;
    }
  }

  goExplorer() {
    this.iab.create(Constants.EXPLORER_API + '/#/tx/' + this.tx, '_system');
  }

  swipeEvent(e) {
    if (e.direction == '2') {
      this.navCtrl.parent.select(2);
    } else if (e.direction == '4') {
      this.navCtrl.parent.select(0);
    }
  }
}
