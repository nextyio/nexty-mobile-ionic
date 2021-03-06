import { Component } from '@angular/core';
import { AlertController, MenuController, NavController, NavParams, Platform } from 'ionic-angular';
import { AbstractControl, FormBuilder, FormGroup, Validators, Form } from "@angular/forms";
import { HomePage } from "../home/home";
import { RestoreService } from "./restore.service";
import { LoadingService } from "../../services/loading.service";
import { Constants } from "../../helper/constants";
import { FileChooser } from '@ionic-native/file-chooser';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';

/**
 * Generated class for the RestorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-restore',
  templateUrl: 'restore.html',
})
export class RestorePage {
  restoreFormPvK: FormGroup;
  restoreForm: FormGroup;
  code: string;
  password: string;
  confirmPassword: string;
  privateKey: string
  public urlFile
  TypeRestore = "bkCode"

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private loadingService: LoadingService,
    private service: RestoreService,
    public platform: Platform,
    private fileChooser: FileChooser,
    private filePicker: IOSFilePicker,
    private filePath: FilePath,
    private file: File,
  ) {
    this.restoreForm = this.formBuilder.group({
      'code': ['', Validators.required],
      'password': ['', Validators.compose([
        Validators.pattern(Constants.PASSWORD_PATTERN),
        Validators.required
      ])],
      'confirmPassword': ['', Validators.required],
    }, {
        validator: this.matchPassword
      });

    this.restoreFormPvK = this.formBuilder.group({
      'privateKey': ['', Validators.required],
      'password': ['', Validators.compose([
        Validators.pattern(Constants.PASSWORD_PATTERN),
        Validators.required
      ])],
      'confirmPassword': ['', Validators.required],
    }, {
        validator: this.matchPassword
      });
  }

  ionViewDidLoad() {
    this.code = '';
    this.privateKey = '';
    this.password = '';
    this.restoreForm.reset();
    this.restoreFormPvK.reset();
  }


  matchPassword(AC: AbstractControl) {
    let password = AC.get('password').value; // to get value in input tag
    let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
    if (password == confirmPassword) {
      AC.get('confirmPassword').setErrors(null);
      return null;
    } else {
      AC.get('confirmPassword').setErrors({ MatchPassword: true })
    }

  }
  // inputPasscode() {
  //   this.confirmPassword = '';
  // }

  restore() {
    if (this.restoreForm.valid) {
      this.code = this.restoreForm.controls['code'].value;
      this.password = this.restoreForm.controls['password'].value;

      this.loadingService.showLoading();
      this.service.restore(this.code, this.password).subscribe((rCode) => {
        this.loadingService.hideloading();
        if (rCode == 0) {
          this.menuCtrl.enable(true, 'main-menu');
          this.navCtrl.setRoot(HomePage);
        } else {
          let alert = this.alertCtrl.create({
            title: 'Invalid restore code, please try again!',
            buttons: [{
              text: 'OK',
              handler: () => {
                this.ionViewDidLoad();
              }
            }]
          });
          alert.present();
        }
      });
    }
  }
  restorePvK() {
    if ((this.restoreFormPvK.controls['privateKey'].value).toString().length != 64) {
      let alert = this.alertCtrl.create({
        title: 'Invalid private key, please try again!',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.ionViewDidLoad();
          }
        }]
      });
      alert.present();
      return;
    }

    if (this.restoreFormPvK.valid) {
      this.privateKey = this.restoreFormPvK.controls['privateKey'].value;
      this.password = this.restoreFormPvK.controls['password'].value;

      this.loadingService.showLoading();
      this.service.restorePvK(this.privateKey, this.password)
        .subscribe((rCode) => {
          this.loadingService.hideloading();
          if (rCode == 0) {
            this.menuCtrl.enable(true, 'main-menu');
            this.navCtrl.setRoot(HomePage);
          } else {
            let alert = this.alertCtrl.create({
              title: 'Invalid Private key, please try again!',
              buttons: [{
                text: 'OK',
                handler: () => {
                  this.ionViewDidLoad();
                }
              }]
            });
            alert.present();
          }
        });
    }
  }

  chooserFile() {
    // this.loadingService.showToat('This feature is coming soon')
    if (this.platform.is('android')) {
      this.fileChooser.open().then(uri => {
        console.log(uri);
        this.getFilePath(uri);
      }).catch(err => {
        console.log(err);
      })
    } else if (this.platform.is('ios')) {
      this.filePicker.pickFile().then(uri => {
        console.log(uri);
        this.getFilePath(uri);
      }).catch(err => {
        console.log(err);
      })
    } else {
      console.log("browser")
      this.fileChooser.open().then(uri => {
        console.log(uri);
        this.getFilePath(uri);
      }).catch(err => {
        console.log(err);
      })
    }

  }
  getFilePath(urlFile) {
    if (this.platform.is('android')) {
      this.filePath.resolveNativePath(urlFile).then(url => {
        let correctPath = url.substr(0, url.lastIndexOf('/') + 1);
        let currentName = url.substring(url.lastIndexOf('/') + 1, url.length);
        if (currentName.substring(currentName.lastIndexOf('.') + 1, currentName.length) == 'txt' && currentName.indexOf('nexty') > -1) {
          this.file.readAsBinaryString(correctPath, currentName).then(response => {
            // var content = JSON.parse(response)
            // console.log(JSON.stringify(response))
            // this.code = content['code-nexty'];
            if (response != null || response != '') {
              this.code = response;
            } else {
              this.loadingService.showToat('Backup file error')
            }
          }).catch(err => {
            console.log(err);
          })
        } else {
          this.loadingService.showToat('Please select a valid backup file')
        }

      })
    } else if (this.platform.is('ios')) {
      let correctPath = 'file://' + urlFile.substr(0, urlFile.lastIndexOf('/') + 1);
      let currentName = urlFile.substring(urlFile.lastIndexOf('/') + 1);
      //&& currentName.substring(0, currentName.indexOf("--")) == 'nexty'
      if (currentName.substring(currentName.lastIndexOf('.') + 1, currentName.length) == 'txt' && currentName.indexOf('nexty') > -1) {
        console.log("correctPath: " + correctPath, "currentName: " + currentName);
        this.file.readAsBinaryString(correctPath, currentName).then(response => {
          console.log(response);
          if (response != null || response != '') {
            this.code = response;
          } else {
            this.loadingService.showToat('Backup file error')
          }
        }).catch(err => {
          console.log(JSON.stringify(err));
        })
      } else {
        this.loadingService.showToat('Please select a valid backup file')
      }
    }
  }
  segmentChanged(item) {
    console.log(item.value)
    this.code = '';
    this.privateKey = '';
    this.password = '';
    this.restoreForm.reset();
    this.restoreFormPvK.reset();
  }
}
