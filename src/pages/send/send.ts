import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { WalletService } from "../../services/wallet.service";
import { BarcodeScanner, BarcodeScanResult } from "@ionic-native/barcode-scanner";
import { RateService } from "../../services/rate.service";
import { Utils } from "../../helper/utils";
import { LoadingService } from "../../services/loading.service";
import bigInt from "big-integer";
@Component({
  selector: 'page-send',
  templateUrl: 'send.html',
})
export class SendPage {

  ntyValue: string;
  usdValue: string;
  toAddress: string;
  checkQRcode: boolean = true;
  isFocusedPNTY: boolean
  isFocusedAddress: boolean
  ExtraData: string;
  public extraDataView: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private loadingService: LoadingService,
    private barcodeScanner: BarcodeScanner,
    private rateService: RateService,
    private walletService: WalletService) {
    this.isFocusedAddress = false;
    this.isFocusedPNTY = false;
  }


  ionViewDidEnter() {
    console.log("SendPage")

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
    if (parseFloat(this.ntyValue) > 0) {
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
    if (nty > 0) {
      let usd = Utils.round(nty * this.rateService.rate, 5);
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
      let nty = Utils.round(usd / this.rateService.rate);
      this.ntyValue = nty.toString();
    } else {
      this.ntyValue = '';
    }
  }

  send() {
    let nty = +this.ntyValue;
    let extraData = this.ExtraData;
    console.log("nty= " + nty);
    if (nty <= 0) {
      console.log("invalid nty");
      return;
    }
    let alert = this.alertCtrl.create({
      title: 'Confirm send',
      message: 'Enter your local passcode to process',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Local passcode'
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
            if (extraData || extraData != null) {
              this.doSend(nty, data['password'], extraData)
            } else {
              this.doSend(nty, data['password'])
            }
          }
        }
      ]
    });
    alert.present();
  }

  doSend(nty, password: string, data?) {
    console.log("type nty: " + typeof (nty))
    this.loadingService.showLoading();
    if (data != null || data != "" || data) {
      this.walletService.send(this.toAddress, nty, password, data).subscribe(
        transactionHash => {
          this.loadingService.hideloading();

          // trigger update balance
          this.walletService.updateBalance();

          // show message
          let alert = this.alertCtrl.create({
            title: 'Send successfully',
            subTitle: transactionHash,
            buttons: ['OK']
          }
          );
          alert.present();
          this.checkQRcode = true;
          this.toAddress = null;
          this.nty = null;
          this.usd = null;

        },
        errorMsg => {
          var msg: string;
          if (errorMsg == 'Returned error: insufficient funds for gas * price + value') {
            msg = "You do not have enough NTY for this transaction"
          } else {
            msg = errorMsg
          }
          this.loadingService.hideloading();
          let alert = this.alertCtrl.create({
            title: 'Send error',
            subTitle: msg,
            buttons: ['OK']
          }
          );
          alert.present();
        });
    } else {
      this.walletService.send(this.toAddress, nty, password).subscribe(
        transactionHash => {
          this.loadingService.hideloading();

          // trigger update balance
          this.walletService.updateBalance();

          // show message
          let alert = this.alertCtrl.create({
            title: 'Send successfully',
            subTitle: transactionHash,
            buttons: ['OK']
          }
          );
          alert.present();
          this.checkQRcode = true;
          this.toAddress = null;
          this.nty = null;
          this.usd = null;

        },
        errorMsg => {
          var msg: string;
          if (errorMsg == 'Returned error: insufficient funds for gas * price + value') {
            msg = "You do not have enough NTY for this transaction"
          } else {
            msg = errorMsg
          }
          this.loadingService.hideloading();
          let alert = this.alertCtrl.create({
            title: 'Send error',
            subTitle: msg,
            buttons: ['OK']
          }
          );
          alert.present();
        });
    }

  }
  cancel() {
    this.checkQRcode = true;
    this.toAddress = null;
    this.nty = null;
    this.usd = null;
    this.ExtraData = null;
    this.extraDataView = null;
    this.isFocusedAddress = false;
    this.isFocusedPNTY = false;
  }
  scanAddress() {
    this.barcodeScanner.scan().then((result: BarcodeScanResult) => {
      console.log(result)
      if (!result.cancelled) {
        if (result.text) {
          try {
            let typeQR = JSON.parse(result.text);
            this.toAddress = typeQR["walletaddress"];
            this.nty = typeQR["amount"];
            var hexExtraData = ''
            for (let i = 0; i < result.text.length; i++) {
              hexExtraData += '' + result.text.charCodeAt(i).toString(16);
            }
            this.ExtraData = '0x' + hexExtraData
            console.log('hex extra data: ' + this.ExtraData)
            this.focusPNTY();
            this.checkQRcode = false;
            this.extraDataView = typeQR["uoid"];
          } catch (e) {
            this.checkQRcode = true;
            this.toAddress = result.text;
            this.nty = null;
            this.usd = null;
            this.ExtraData = null;
            this.extraDataView = null;
          }
        }
        this.isFocusedAddress = true;
      }
    }, (err) => {
      console.log('Error: ', err);
    });
  }
}
