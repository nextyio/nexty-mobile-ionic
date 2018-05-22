import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, Platform } from 'ionic-angular';
import { Clipboard } from "@ionic-native/clipboard";
import { BackupService } from "./backup.service";
import { LoadingService } from "../../services/loading.service";
import { DataService } from '../../services/data.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { Subject } from 'rxjs/Subject';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { IOSFilePicker } from '@ionic-native/file-picker';

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-backup',
  templateUrl: 'backup.html',
})
export class BackupPage {

  code: string;
  copied: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingService: LoadingService,
    private alertCtrl: AlertController,
    private service: BackupService,
    private clipboard: Clipboard,
    private dataservice: DataService,
    private socialSharing: SocialSharing,
    private filePath: FilePath,
    private filePicker: IOSFilePicker,
    public platform: Platform,
  ) {
  }

  ionViewDidLoad() {
    // start recurring
    this.code = '';
    this.copied = false;
  }

  backedUp(): boolean {
    return !!this.code;
  }

  backup() {
    let alert = this.alertCtrl.create({
      title: 'Confirm backup',
      message: 'Enter your password to process',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Password',
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
          text: 'Backup',
          handler: (data) => {
            this.doBackup(data['password'])
          }
        }
      ]
    });
    alert.present();
  }

  doBackup(password: string) {
    this.loadingService.show();
    this.service.backup(password).subscribe((errMsg) => {
      this.loadingService.hide();
      if (errMsg) {
        let alert = this.alertCtrl.create({
          title: 'Backup failed',
          message: errMsg,
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Try again',
              handler: () => {
                this.backup();
              }
            }
          ]
        });
        alert.present();
      } else {
        this.code = this.service.code;
      }
    });
  }

  copy() {
    this.clipboard.copy(this.code);
    this.copied = true;
    this.dataservice.setBackup(this.code).subscribe(value => {
      console.log("data backup" + JSON.stringify(value));
    });
  }
  shareFile() {
    if (this.platform.is('android')) {
      console.log(this.service.urlFile);
      this.filePath.resolveNativePath(this.service.urlFile).then(path => {
        this.socialSharing.share(null, null, path).then(value => {
          console.log(value);
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    } else if (this.platform.is('ios')) {
      this.socialSharing.share(null, null, this.service.urlFile);
    }
  }
}
