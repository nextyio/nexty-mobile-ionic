import { Component } from '@angular/core';
import { MenuController, NavController, NavParams } from 'ionic-angular';
import { HomePage } from "../home/home";
import { AuthService } from "../../services/auth.service";
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { DataService } from '../../services/data.service';

const PASSWORD_PATTERN = /^.{6,}$/;

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  registerForm: FormGroup;

  password: string;
  isConfirmFocus = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private iab: InAppBrowser,
    private formBuilder: FormBuilder,
    private menuCtrl: MenuController,
    private authService: AuthService,
    private dataservice: DataService
  ) {
    this.registerForm = this.formBuilder.group({
      'password': ['', Validators.compose([
        Validators.pattern(PASSWORD_PATTERN),
        Validators.required
      ])
      ],
      'confirmPassword': ['', Validators.required]
    }, {
        validator: this.matchPassword
      });
  }

  ionViewDidLoad() {
    this.password = '';
  }

  focusConfirm() {
    if (this.registerForm.controls['confirmPassword'].value.length > 0) {
      this.isConfirmFocus = true;
    }
  }

  matchPassword(AC: AbstractControl) {
    let password = AC.get('password').value; // to get value in input tag
    let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
    if (password != confirmPassword) {
      AC.get('confirmPassword').setErrors({ MatchPassword: true })
    } else {
      AC.get('confirmPassword').setErrors(null)
      return null
    }
  }

  register() {
    // this.loadingService.show();
    if (this.registerForm.valid) {
      this.password = this.registerForm.controls['password'].value;
      this.authService.register(this.password).subscribe(() => {
        this.menuCtrl.enable(true, 'main-menu');
        // this.loadingService.hide();
        this.navCtrl.setRoot(HomePage);
        this.dataservice.clearBackup();
      });
    }

  }

  viewToS() {
    this.iab.create('https://nexty.io/privacy-policy.html', '_system');
  }
}
