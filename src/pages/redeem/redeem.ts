import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Nav } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpErrorResponse, HttpHandler, HttpHeaders } from '@angular/common/http';
import { BarcodeScanner, BarcodeScanResult } from '@ionic-native/barcode-scanner';
import { HomePage } from '../home/home';
import { LoadingService } from '../../services/loading.service';

/**
 * Generated class for the RedeemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-redeem',
  templateUrl: 'redeem.html',
})
export class RedeemPage {
  @ViewChild(Nav) nav: Nav;
  activePage: boolean = false;
  amount: number;
  QRcode: string;
  expired: boolean = false;
  show: boolean = false;
  getValue: boolean = false;
  notExist: boolean = false;
  statusQR: boolean = false;
  error: boolean = false;
  used: boolean = false;
  NTY: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    private http: HttpClient,
    private authService: AuthService,
    private loadingservice: LoadingService,
  ) {
  }

  ionViewDidLoad() {

    this.loadingservice.show();
    try {
      this.http.get('https://coupon.nexty.io/api/Coupon/info?couponcode=' + this.navParams.data)
        .subscribe(qr => {
          if (qr == null || qr == '') {
            this.error = true;
            this.notExist = true;
            this.loadingservice.hide()
          } else {
            console.log('Status get: ' + qr['statusCode']);
            this.setFalse();
            switch (qr['statusCode']) {
              case 0:
                this.getValue = true;
                this.amount = qr['amount'];
                this.QRcode = qr['couponCode'];
                break;
              case 1:
                this.error = true;
                this.used = true;
                break;
              default:
                this.error = true;
                this.expired = true;
                break;
            }
            this.loadingservice.hide()
          }

        }), err => {
          this.loadingservice.hide();
          console.log(err)
        }
    } catch (error) {
      console.log(error)
    }

  }
  setFalse() {
    this.expired = false;
    this.show = false;
    this.getValue = false;
    this.notExist = false;
    this.statusQR = false;
    this.error = false;
    this.used = false;
  }
  redeem() {
    this.loadingservice.show()
    console.log('QR code: ' + this.QRcode, 'walett: ' + this.authService.address)
    // let body = {
    //   couponCode: this.QRcode,
    //   nextyWallet: this.authService.address
    // }
    try {
      let body = 'couponCode=' + this.QRcode + '&nextyWallet=' + this.authService.address
      this.http.post('https://coupon.nexty.io/api/Coupon/redeem', body, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        .subscribe(res => {
          console.log('Status get: ' + res['statusCode']);
          this.setFalse();
          this.statusQR = true;
          this.loadingservice.hide()
        }), (err: HttpErrorResponse) => {
          console.log(err.error);
          console.log(err.name);
          console.log(err.message);
          console.log(err.status);
          this.loadingservice.hide()
        }
    } catch (error) {
      this.loadingservice.hide()
    }
  }

  scanQR() {
    this.loadingservice.show();
    this.barcodeScanner.scan().then((result: BarcodeScanResult) => {
      if (!result.cancelled) {
        try {
          this.http.get('https://coupon.nexty.io/api/Coupon/info?couponcode=' + result.text)
            .subscribe(qr => {
              this.setFalse();
              if (qr == null || qr == '') {
                this.error = true;
                this.notExist = true;
                this.loadingservice.hide()
              } else {
                switch (qr['statusCode']) {
                  case 0:
                    this.getValue = true;
                    this.amount = qr['amount'];
                    this.QRcode = qr['couponCode'];
                    break;
                  case 1:
                    this.error = true;
                    this.used = true;
                    break;
                  default:
                    this.error = true;
                    this.expired = true;
                    break;
                }
                this.loadingservice.hide()
              }

            }), err => {
              this.loadingservice.hide();
              console.log(err)
            }
        } catch (error) {
          this.loadingservice.hide()
          console.log(error)
        }

      } else {
        if (!this.activePage) {
          this.loadingservice.hide();
          this.navCtrl.pop();
        }
      }
    })
  }
  goDashboard() {
    this.navCtrl.setRoot(HomePage);
  }
}

