import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { WalletService } from '../../services/wallet.service';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../services/data.service';

/**
 * Generated class for the SmartContractPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-smart-contract',
  templateUrl: 'smart-contract.html',
})
export class SmartContractPage {
  // public SmartContract: any = "0xc306e7db50db340873675724a5073fa986596219";
  public SmartContract: any;
  public ABI
  PrivateKey;
  TokenSymbol;
  TokenDecimals;
  TokenValid = false;
  tokenExist = false;
  TokenBalance;
  public ArrayToken = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private walletService: WalletService,
    private authService: AuthService,
    private loading: LoadingService,
    public http: HttpClient,
    private alertCtrl: AlertController,
    private dataService: DataService
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SmartContractPage');
  }

  AddToken() {
    this.tokenExist = false;
    this.ArrayToken = []
    this.loading.show();
    console.log("click")
    // get token from storage app
    this.dataService.getToken().subscribe(token => {
      // check token exist
      if (token != null) {
        this.ArrayToken = JSON.parse(token);
        // this.ArrayToken.forEach(TokenItem => {
        console.log(this.ArrayToken.indexOf(x => x['tokenAddress'] == this.SmartContract))
        if (this.ArrayToken.findIndex(x => x['tokenAddress'] == this.SmartContract) > -1) {
          this.loading.hide()
          this.tokenExist = true;
          this.TokenValid = false;
          console.log('token has exist')
        } else {
          try {
            this.loading.hide();
            this.ArrayToken.push({
              'tokenAddress': this.SmartContract,
              'balance': this.TokenBalance,
              'symbol': this.TokenSymbol,
              'decimal': this.TokenDecimals,
              'ABI': this.ABI
            })
            this.dataService.setToken(JSON.stringify(this.ArrayToken)).subscribe(data => {
              this.loading.showToat('Add token success');
              this.clear();
            })
          } catch (error) {
            this.loading.hide();
            this.loading.alert(error);
          }
        }
        // });
      } else {
        console.log('data null')
        try {
          this.loading.hide();
          this.ArrayToken.push({
            'tokenAddress': this.SmartContract,
            'balance': this.TokenBalance,
            'symbol': this.TokenSymbol,
            'decimal': this.TokenDecimals,
            'ABI': this.ABI
          })
          this.dataService.setToken(JSON.stringify(this.ArrayToken)).subscribe(data => {
            this.loading.showToat('Add token successfully');
            this.clear();
          })
        } catch (error) {
          this.loading.hide();
          this.loading.alert(error);
        }
      }
    })
  }

  getInfo() {
    if (this.SmartContract == '' || this.SmartContract == null) {
      return;
    }
    try {
      console.log("smartContract: " + this.SmartContract, "TokenSymbol: " + this.TokenSymbol, "TokenValid: " + this.TokenValid)
      this.TokenValid = false;
      this.walletService.GetInfoToken(this.SmartContract)
        .subscribe((data) => {
          console.log("dataaa: " + JSON.stringify(data), )
          this.TokenSymbol = this.walletService.TokenSymbol;
          this.TokenDecimals = this.walletService.TokenDecimals;
          this.TokenBalance = this.walletService.TokenBalance;
          this.ABI = this.walletService.ABI;
          setTimeout(() => {
            if (this.TokenSymbol == null || this.TokenSymbol == '') {
              this.TokenValid = true;
              this.tokenExist = false;
              return;
            }
          }, 200);
        }), err => {
          console.log(err)
        }
    } catch (error) {
      console.log('catch')
      this.TokenValid = true;
      this.TokenSymbol = '';
      this.tokenExist = false;
    }
  }
  clearCache() {
    this.dataService.clearBackup();
  }
  clear() {
    this.SmartContract = null;
    this.TokenBalance = null;
    this.TokenSymbol = null;
    this.TokenDecimals = null;
    this.TokenValid = false;
    this.tokenExist = false;
  }
  multilToken() {
    this.dataService.getToken().subscribe(token => {
      this.ArrayToken = JSON.parse(token);
      for (let index = 0; index < 10; index++) {
        this.ArrayToken.push({
          'tokenAddress': this.SmartContract,
          'balance': this.TokenBalance,
          'symbol': this.TokenSymbol + '_' + index,
          'decimal': this.TokenDecimals,
          'ABI': this.ABI
        })
      }
      this.dataService.setToken(JSON.stringify(this.ArrayToken)).subscribe(data => {
      })
    })
  }
}
