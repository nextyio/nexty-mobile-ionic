import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, Platform } from 'ionic-angular';
import { Clipboard } from "@ionic-native/clipboard";
import { BackupService } from "./backup.service";
import { LoadingService } from "../../services/loading.service";
import { DataService } from '../../services/data.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import moment from 'moment';
import { AuthService } from '../../services/auth.service';
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
  public urlFile: string;
  public namefile: string;
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
    public platform: Platform,
    private file: File,
    private authService: AuthService,
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
      message: 'Enter your local passcode to process',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Local passcode',
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
    this.loadingService.showLoading();
    this.service.backup(password).subscribe((errMsg) => {
      this.loadingService.hideloading();
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
        // create name keystore
        var dateTime = new Date();
        let name = 'nexty--' + moment().format('YYYY-MM-DD') + '-' + dateTime.getTime() + '--' + this.authService.address + '.txt';
        // save file keystore 
        // var dataFile = { "code-nexty": this.service.code }
        if (this.platform.is('android')) {
          // console.log("content: " + JSON.stringify(dataFile));
          this.file.writeFile(this.file.externalDataDirectory, name, this.service.code + '').then(res => {
            this.loadingService.showToat('save file: ' + res.nativeURL);
            console.log(JSON.stringify(res));
            this.urlFile = res.nativeURL;
            // var newPath = this.urlFile.substr(0, this.urlFile.lastIndexOf('/And') + 1);
            // this.file.checkDir(newPath, 'BackupNexty').then(exists => {
            //   if (!exists) {
            //     this.file.createDir(newPath, "BackupNexty", false).then(path => {
            //       console.log("path:", path, JSON.stringify(path))
            //       this.file.writeFile(path.nativeURL, name, this.code + '').then(resfile => {
            //         console.log(JSON.stringify(resfile));
            //       })
            //       var pathOld = this.urlFile.substr(0, this.urlFile.lastIndexOf('/') + 1)
            //     })
            //   } else {

            //     this.file.writeFile(newPath + 'BackupNexty/', name, this.code + '').then(resfile => {
            //       console.log(JSON.stringify(resfile));
            //     })
            //   }
            // })

          }).catch(err => {
            console.log(err);
          })
        } else if (this.platform.is('ios')) {
          this.file.writeFile(this.file.tempDirectory, name, this.service.code + '')
            .then(res => {
              console.log("write file success: " + JSON.stringify(res));
              this.urlFile = res.nativeURL;
              this.socialSharing.share(null, null, res.nativeURL).then(value => {
                console.log(value);
              })
            }).catch(err => {
              console.log("Error", JSON.stringify(err));
            })
        }
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
      console.log(this.urlFile);
      this.filePath.resolveNativePath(this.urlFile).then(path => {
        this.socialSharing.share(null, null, path).then(value => {
          console.log(value);
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    } else if (this.platform.is('ios')) {
      this.socialSharing.share(null, null, this.urlFile);
    }
  }
}
