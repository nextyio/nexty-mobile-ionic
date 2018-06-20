import { Component } from '@angular/core';
import { MenuController, NavController, NavParams } from 'ionic-angular';
import { HomePage } from "../home/home";
import { AuthService } from "../../services/auth.service";
import { BarcodeScanner, BarcodeScanResult } from "@ionic-native/barcode-scanner";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const PASSWORD_PATTERN = /^.{6,}$/;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;
  loginFail: boolean = false;

  address: string;
  password: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private menuCtrl: MenuController,
    private barcodeScanner: BarcodeScanner,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      'address': ['', Validators.required],
      'password': ['', Validators.compose([
        Validators.pattern(PASSWORD_PATTERN),
        Validators.required
      ])
      ]
    });
  }

  ionViewDidLoad() {
    this.address = this.authService.address;
    this.password = '';
    this.loginFail = false;
  }

  scan() {
    this.barcodeScanner.scan().then((result: BarcodeScanResult) => {
      if (!result.cancelled) {
        this.address = result.text;
      }
    }, (err) => {
      console.log('Error: ', err);
    });
  }
  focusPw() {
    this.loginFail = false;
  }
  login() {
    if (this.loginForm.valid) {
      this.address = this.loginForm.controls['address'].value;
      this.password = this.loginForm.controls['password'].value;
      this.authService.login(this.address, this.password).subscribe(() => {
        this.menuCtrl.enable(true, 'main-menu');
        this.navCtrl.setRoot(HomePage);
      }, () => {
        this.loginFail = true;
      });
    }
  }
}
