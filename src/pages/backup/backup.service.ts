import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/delay';
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../../services/auth.service";
import * as CryptoJS from "crypto-js";
import { Constants } from "../../helper/constants";
import "rxjs/add/operator/catch";
import { Utils } from "../../helper/utils";
import { File } from '@ionic-native/file';
import moment from 'moment';
import { LoadingService } from "../../services/loading.service";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Platform } from "ionic-angular";

@Injectable()
export class BackupService {

  code: string;
  public urlFile: string;
  public namefile: string;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private file: File,
    private loadingService: LoadingService,
    private socialSharing: SocialSharing,
    public platform: Platform,
  ) {
  }

  backup(password: string): Observable<any> {

    if (!this.authService.validatePassword(password)) {
      return Observable.of('Invalid local password');
    }

    this.code = Utils.generateRandom(32);
    let pk = this.authService.getPrivateKey(password);

    let data = {
      md5Hash: CryptoJS.MD5(this.code).toString(CryptoJS.enc.Hex),
      walletAddress: this.authService.address,
      privateKeyEncrypted: CryptoJS.AES.encrypt(pk, this.code).toString()
    };

    // create name keystore
    var dateTime = new Date();
    let name = 'nexty--' + moment().format('YYYY-MM-DD') + '-' + dateTime.getTime() + '--' + this.authService.address + '.txt';

    // save file keystore 
    if (this.platform.is('android')) {
      this.file.writeFile(this.file.externalDataDirectory, name, this.code + '').then(res => {
        this.loadingService.showToat('save file: ' + res.nativeURL);
        this.urlFile = res.nativeURL;
      }).catch(err => {
        console.log(err);
      })
    } else if (this.platform.is('ios')) {
      this.file.writeFile(this.file.tempDirectory, name, this.code + '')
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

    return this.http.post(Constants.WALLET_API + "/api/backup", data)
      .catch((err: Response) => {
        if (err.status == 200) {
          return Observable.of(null);
        } else {
          return Observable.of('Something wrongs. Do you want to try again?');
        }
      });
  }
}
