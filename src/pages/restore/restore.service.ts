import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/delay';
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../../services/auth.service";
import * as CryptoJS from "crypto-js";
import { Constants } from "../../helper/constants";
import "rxjs/add/operator/catch";
import { WalletService } from "../../services/wallet.service";

@Injectable()
export class RestoreService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private walletsevice: WalletService
  ) {
  }

  restore(code: string, password: string): Observable<any> {

    let data = {
      md5Hash: CryptoJS.MD5(code).toString(CryptoJS.enc.Hex),
    };
    return this.http.post(Constants.WALLET_API + "/api/restore", data)
      .mergeMap((res: Response) => {
        let addr = res['walletAddress'];
        if (addr) {
          let privateKeyEncrypted = res['privateKeyEncrypted'];
          let privateKey = CryptoJS.AES.decrypt(privateKeyEncrypted, code).toString(CryptoJS.enc.Utf8);
          console.log(privateKey)
          return this.authService.restore(addr, privateKey, password).mergeMap(() => Observable.of(0));
        }
        return Observable.of(1);
      })
      .catch((err: Response) => {
        return Observable.of(1);
      });
  }
  restorePvK(privateKey: string, password: string): Observable<any> {
    console.log(privateKey)
    return this.walletsevice.getAddressFromPrivateKey(privateKey)
      .mergeMap((res: Response) => {
        console.log("aaaaaaa " + res)
        let addr = res.toString();
        if (addr) {
          return this.authService.restore(addr, privateKey, password).mergeMap(() => Observable.of(0));
        }
        return Observable.of(1);
      })
      .catch((err: Response) => {
        return Observable.of(1);
      });
  }
}
