import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { WalletService } from "../../services/wallet.service";
import { BarcodeScanner, BarcodeScanResult } from "@ionic-native/barcode-scanner";
import { RateService } from "../../services/rate.service";
import { Utils } from "../../helper/utils";
import { LoadingService } from "../../services/loading.service";
import { Constants } from "../../helper/constants";
import bigInt from "big-integer";
@Component({
  selector: 'page-send',
  templateUrl: 'send.html',
})
export class SendPage {

  ntyValue: string;
  usdValue: string;
  toAddress: string;

  isFocusedPNTY: boolean
  isFocusedAddress: boolean

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController,
    private loadingService: LoadingService,
    private barcodeScanner: BarcodeScanner,
    private rateService: RateService,
    private walletService: WalletService) {
    this.isFocusedAddress = false;
    this.isFocusedPNTY = false;
  }

  ionViewDidLoad() {
  }

  focusAddress() {
    this.isFocusedAddress = true;
  }

  focusPNTY() {
    this.isFocusedPNTY = true;
  }

  isValidAddress() {
    if (this.toAddress != '') {
      return true;
    } else {
      return false;
    }
  }

  isValidPNTY() {
    if (parseInt(this.ntyValue) > 0) {
      return true;
    } else {
      return false;
    }
  }

  get getFocusAddress(): boolean {
    return this.isFocusedAddress;
  }

  get getFocusPNTY(): boolean {
    return this.isFocusedPNTY;
  }

  get nty(): string {
    return this.ntyValue;
  }

  set nty(value: string) {
    this.ntyValue = value;
    // calculate usd
    let nty = +this.ntyValue;
    if (!isNaN(nty) && (nty > 0)) {
      let usd = Utils.round(nty * this.rateService.rate / Constants.PNTY_NTY, 2);
      this.usdValue = usd.toString();
    } else {
      this.usdValue = '';
    }
  }

  get usd(): string {
    return this.usdValue;
  }

  set usd(value: string) {
    this.usdValue = value;
    // calculate pnty
    let usd = +this.usdValue;
    if (!isNaN(usd) && (usd > 0) && this.rateService.rate > 0) {
      let nty = Utils.round(usd / this.rateService.rate * Constants.PNTY_NTY);
      this.ntyValue = nty.toString();
    } else {
      this.ntyValue = '';
    }
  }

  send() {
    let nty = +this.ntyValue;
    console.log("nty= " + nty);
    if (isNaN(nty) || (nty <= 0)) {
      console.log("invalid nty");
      return;
    }
    let alert = this.alertCtrl.create({
      title: 'Confirm send',
      message: 'Enter your local password to process',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Local Password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: (data) => {
            this.doSend(bigInt(nty), data['password'])
          }
        }
      ]
    });
    alert.present();
  }

  doSend(nty, password: string) {
    this.loadingService.showLoading();
    this.walletService.send(this.toAddress, nty, password).subscribe(
      transactionHash => {
        this.loadingService.hideloading();

        // trigger update balance
        this.walletService.updateBalance();

        // show message
        let alert = this.alertCtrl.create({
          title: 'Send success',
          subTitle: transactionHash,
          buttons: ['OK']
        }
        );
        alert.present();

        this.toAddress = null;
        this.nty = null;
        this.usd = null;

      },
      errorMsg => {
        this.loadingService.hide();
        let alert = this.alertCtrl.create({
          title: 'Send error',
          subTitle: errorMsg,
          buttons: ['OK']
        }
        );
        alert.present();
      });
  }

  scanAddress() {
    this.barcodeScanner.scan().then((result: BarcodeScanResult) => {
      if (!result.cancelled) {
        this.toAddress = result.text;
        this.isFocusedAddress = true;
      }
    }, (err) => {
      console.log('Error: ', err);
    });
  }
}
