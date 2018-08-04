import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, PopoverController } from 'ionic-angular';
import { WalletService } from "../../services/wallet.service";
import { BarcodeScanner, BarcodeScanResult } from "@ionic-native/barcode-scanner";
import { RateService } from "../../services/rate.service";
import { Utils } from "../../helper/utils";
import { LoadingService } from "../../services/loading.service";
import bigInt from "big-integer";
import { PopoverComponent } from '../../components/popover/popover';
import { FcmService } from '../../services/fcm.service';
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
  activeAddToken: boolean = false;

  public Contract = {
    'tokenAddress': null,
    'balance': null,
    'symbol': 'NTY',
    'decimal': null,
    'ABI': null
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private loadingService: LoadingService,
    private barcodeScanner: BarcodeScanner,
    private rateService: RateService,
    private walletService: WalletService,
    public popoverCtrl: PopoverController,
    private fcm: FcmService,
  ) {
    this.isFocusedAddress = false;
    this.isFocusedPNTY = false;
    try {
      this.fcm.showAddToken()
        .subscribe(status => {
          if (status) {
            this.activeAddToken = status.value;
          } else {
            this.activeAddToken = false;
          }
        })
    } catch (error) {
      this.activeAddToken = false;
    }
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
      // check NTY or Token
      if (this.Contract.symbol == 'NTY') {
        let usd = Utils.round(nty * this.rateService.rate, 5);
        this.usdValue = usd.toString();
      } else {
        this.usdValue = '0';
      }
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
      // check NTY or Token
      if (this.Contract.symbol == 'NTY') {
        let nty = Utils.round(usd / this.rateService.rate);
        this.ntyValue = nty.toString();
      } else {
        this.ntyValue = '0';
      }
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
            if (this.Contract.symbol == 'NTY') {
              if (extraData || extraData != null) {
                this.doSend(nty, data['password'], extraData)
              } else {
                this.doSend(nty, data['password'])
              }
            } else {
              if (extraData || extraData != null) {
                this.doSendToken(nty, data['password'], extraData)
              } else {
                this.doSendToken(nty, data['password'])
              }
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

  doSendToken(nty, password: string, data?) {
    console.log("type nty: " + typeof (nty))
    this.loadingService.showLoading();

    this.walletService.sendToken(this.toAddress, this.Contract.tokenAddress, this.Contract.ABI, nty, password).subscribe(
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
          msg = "You do not have enough " + this.Contract.symbol + " for this transaction"
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
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverComponent);
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(data => {

      if (data != null) {
        this.Contract = data;
        console.log(this.Contract);
        this.nty = null;
        this.usd = null;
      }
    })

  }
}
