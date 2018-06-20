import {Injectable} from "@angular/core";
import {WalletService} from "../../services/wallet.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class DetailService {

  transaction: any;

  constructor(private walletService: WalletService) {

  }

  initData(tx: string): Observable<any> {
    return Observable.fromPromise(
      this.walletService.web3.eth.getTransaction(tx)
    ).map(data => {

    });
  }
}
