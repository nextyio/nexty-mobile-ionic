import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/delay';
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../../services/auth.service";
import * as CryptoJS from "crypto-js";
import { Constants } from "../../helper/constants";
import "rxjs/add/operator/catch";
import { Utils } from "../../helper/utils";

@Injectable()
export class BackupService {

  code: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
  }

  backup(password: string): Observable<any> {

    if (!this.authService.validatePassword(password)) {
      return Observable.of('Invalid local passcode');
    }

    this.code = Utils.generateRandom(32);
    let pk = this.authService.getPrivateKey(password);

    let data = {
      md5Hash: CryptoJS.MD5(this.code).toString(CryptoJS.enc.Hex),
      walletAddress: this.authService.address,
      privateKeyEncrypted: CryptoJS.AES.encrypt(pk, this.code).toString()
    };

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
