import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/throw';
import Web3 from "web3";
import { Constants } from "../helper/constants";
import { sign } from "@warren-bank/ethereumjs-tx-sign"
import { Tx } from "web3/types";
import { AuthService } from "./auth.service";
import { Subscription } from "rxjs/Subscription";
import bigInt from "big-integer";
@Injectable()
export class WalletService {

  web3: Web3;
  balance: number;
  balanceRecurring: Subscription;

  constructor(private authService: AuthService) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(Constants.WEB3_API));
    this.balance = 0;
  }

  updateBalance(): Observable<any> {
    return Observable.fromPromise(
      this.web3.eth.getBalance(this.authService.address).catch(
        err => {
          console.log(err);
          return Promise.resolve(0);
        }
      )
    ).map(value => {
      if (value >= 0) {
        this.balance = value;
      } else {
        this.balance = 0;
      }
    })
  }

  startBalanceRecurring() {
    this.balanceRecurring = Observable.interval(Constants.TIMER_UPDATE_BALANCE)
      .subscribe(() => {
        this.updateBalance().subscribe();
      });
  }

  stopBalanceRecurring() {
    this.balanceRecurring.unsubscribe();
  }


  send(address: string, nty: number, password: string): Observable<any> {
    // check password
    if (!this.authService.validatePassword(password)) {
      return Observable.throw("Password invalid");
    }

    // check address
    if (!this.web3.utils.isAddress(address)) {
      return Observable.throw("Address invalid");
    }

    // let sendValue = Constants.BASE_NTY.valueOf() * nty;
    let sendValue = Constants.BASE_NTY2.valueOf() * nty;
    let hexValue = '0x' + bigInt(sendValue).toString(16);
    console.log("hexValue= " + hexValue, "sendValue= " + bigInt(sendValue).toString(), 'decValue= ' + parseInt(hexValue, 16) / Constants.BASE_NTY, nty)
    // let sendValue2 = Constants.BASE_NTY * nty;
    // let hexValue2 = '0x'+ sendValue2.toString(16);
    // console.log('hexvalue2= '+hexValue2,'sendvalue2= '+sendValue2, 'sendtohex=' +sendValue2.toString())
    let txData: Tx = {
      from: this.authService.address,
      to: address,
      value: hexValue
    };
    return Observable.fromPromise(this.web3.eth.getTransactionCount(this.authService.address))
      .mergeMap((nonce) => {
        return new Observable(observer => {
          txData.nonce = nonce;
          this.estimateGas(txData).subscribe(gas => {
            txData.gas = gas;
            let rawTx;
            try {
              rawTx = '0x' + this.signTransaction(txData, this.authService.getPrivateKey(password));
            } catch (ex) {
              console.log(ex);
              observer.error("Cannot sign transaction");
              return;
            }

            this.web3.eth.sendSignedTransaction(rawTx, (error, hash) => {
              if (error) {
                observer.error(error.message);
              } else {
                // update balance
                this.updateBalance().subscribe(() => {
                  observer.next(hash);
                });
              }
            }).catch(err => {
              // ignore error
              // console.log(err.message);
            });
          });
        });
      });
  }

  private estimateGas(transaction: Tx): Observable<number> {
    return Observable.fromPromise(
      this.web3.eth.estimateGas(transaction)
    );
  }

  private signTransaction(txData: Tx, privateKey: string): string {
    let { rawTx } = sign(txData, privateKey);
    return rawTx;
  }
}
