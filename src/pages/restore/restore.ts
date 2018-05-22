import { Component } from '@angular/core';
import { AlertController, MenuController, NavController, NavParams, Platform } from 'ionic-angular';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
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

  restoreForm: FormGroup;
  code: string;
  password: string;
  public urlFile

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
      'confirmPassword': ['', Validators.required]
    }, {
        validator: this.matchPassword
      });
  }

  ionViewDidLoad() {
    this.code = '';
    this.password = '';
    this.restoreForm.reset();
  }


  matchPassword(AC: AbstractControl) {
    let password = AC.get('password').value; // to get value in input tag
    let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
    if (password != confirmPassword) {
      AC.get('confirmPassword').setErrors({ MatchPassword: true })
    } else {
      return null;
    }
  }

  restore() {
    if (this.restoreForm.valid) {
      this.code = this.restoreForm.controls['code'].value;
      this.password = this.restoreForm.controls['password'].value;

      this.loadingService.show();
      this.service.restore(this.code, this.password).subscribe((rCode) => {
        this.loadingService.hide();
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

  chooserFile() {
    this.loadingService.showToat('This feature is coming soon')
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
        this.file.readAsBinaryString(correctPath, currentName).then(response => {
          this.code = response;
        }).catch(err => {
          console.log(err);
        })
      })
    } else if (this.platform.is('ios')) {
      let correctPath = 'file://' + urlFile.substr(0, urlFile.lastIndexOf('/') + 1);
      let currentName = urlFile.substring(urlFile.lastIndexOf('/') + 1);
      console.log("correctPath: " + correctPath, "currentName: " + currentName);
      this.file.readAsText(correctPath, currentName).then(response => {
        console.log(response);
        this.code = response;
      }).catch(err => {
        console.log(JSON.stringify(err));
      })
    }
  }
}
