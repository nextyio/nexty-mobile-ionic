import { Injectable, trigger } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/throw';
import Web3 from "web3";
import { Constants } from "../helper/constants";
import { sign } from "@warren-bank/ethereumjs-tx-sign"
import { Tx } from "web3/types";
import { AuthService } from "./auth.service";
import { Subscription } from "rxjs/Subscription";
import bigInt from "big-integer";
import { HttpClient } from "@angular/common/http";
import { single } from "rxjs/operators";
@Injectable()
export class WalletService {

  web3: Web3;
  balance: number;
  balanceRecurring: Subscription;
  TokenSymbol;
  TokenDecimals;
  TokenBalance;
  public ABI

  constructor(private authService: AuthService, public http: HttpClient, ) {
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
        // console.log("balance: " + this.balance);
      } else {
        this.balance = 0;
      }
    })
  }
  getBalance(address): Observable<any> {
    return Observable.fromPromise(
      this.web3.eth.getBalance(address)
    )
  }

  updateBalanceToken(AddressToken, ABI): Observable<any> {
    var Contract = new this.web3.eth.Contract(ABI, AddressToken);
    return Observable.fromPromise(
      Contract.methods.balanceOf(this.authService.address).call().then(data => {
        return data;
      })
    )
  }



  GetInfoToken(ContractAddress): Observable<any> {
    this.ABI = [{ "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "owners", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "sendTokens", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "INITIAL_SUPPLY", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "manager", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_subtractedValue", "type": "uint256" }], "name": "decreaseApproval", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getOwners", "outputs": [{ "name": "", "type": "address[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "tokenWallet", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "endDate", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_addedValue", "type": "uint256" }], "name": "increaseApproval", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "remaining", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "ownerByAddress", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_owners", "type": "address[]" }], "name": "setOwners", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "tokenOwner", "type": "address" }, { "name": "_endDate", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "owners", "type": "address[]" }], "name": "SetOwners", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }]
    var ContractABI = new this.web3.eth.Contract(this.ABI, ContractAddress);
    console.log(ContractABI.methods)
    ContractABI.methods.balanceOf('0x98f788606c518bf8def8cc1c331b8b21b7a78a5a').call().then(data => {
      console.log("balance accout send: " + data)
    }).catch(err => {
      return new Observable(ob => {
        ob.error(err);
        return;
      })
    })
    ContractABI.methods.balanceOf(this.authService.address).call().then(data => {
      console.log("balance accout recipient: " + data)
    }).catch(err => {
      return new Observable(ob => {
        ob.error(err)
        return;
      })
    })
    // ContractABI.methods.transfer('0xd149bafb1cb4dd9ff171eb629749420bd8b2da83', 10000).estimateGas({ from: this.authService.address })
    //   .then(gasAmout => { console.log(gasAmout) })
    return Observable.forkJoin([
      ContractABI.methods.balanceOf(this.authService.address).call().catch(err => {
        return null;
      }),
      ContractABI.methods.symbol().call().catch(err => {
        return null;
      }),
      ContractABI.methods.decimals().call().catch(err => {
        return null;
      })
    ]).map(data => {
      if (data[0] == null && data[1] == null && data[2] == null) {
        this.TokenBalance = '';
        this.TokenSymbol = '';
        this.TokenDecimals = '';
        return new Observable(ob => { ob.error("Token Valid"); return; })
      } else {
        this.TokenBalance = data[0];
        this.TokenSymbol = data[1];
        this.TokenDecimals = data[2]
      }
    })
  }


  sendToken(toAdrdess, tokenAddress, ABI, token: number, password): Observable<any> {
    // check password
    if (!this.authService.validatePassword(password)) {
      return Observable.throw("Invalid local passcode");
    }

    // check address
    if (!this.web3.utils.isAddress(toAdrdess)) {
      return Observable.throw("Invalid address");
    }

    var Contract = new this.web3.eth.Contract(ABI, tokenAddress, { from: this.authService.address });
    let txData: Tx;
    // Use Gwei for the unit of gas price
    var gasPriceGwei = 0;

    txData = {
      from: this.authService.address,
      to: tokenAddress,
      value: "0x0",
      data: Contract.methods.transfer(toAdrdess, token).encodeABI(),
      chainId: 66666,
      // gasPrice: this.web3.utils.toHex(gasPriceGwei * 1e9)
    }

    return Observable.fromPromise(
      this.web3.eth.getTransactionCount(this.authService.address)
    ).mergeMap((nonce) => {
      return new Observable(ob => {
        txData.nonce = nonce;

        this.web3.eth.estimateGas(txData).then(data => { console.log(data) })
          .catch(error => {
            console.log(error)
            ob.error("Returned error: insufficient funds for gas * price + value");
            return;
          })

        this.estimateGas(txData).subscribe(gas => {
          txData.gas = gas;
          console.log("gas " + gas)
          let rawTx;
          try {
            rawTx = '0x' + this.signTransaction(txData, this.authService.getPrivateKey(password));
            console.log('sign transaction success ' + rawTx)
          } catch (ex) {
            console.log(ex);
            ob.error('cannot sign transaction');
            return;
          }
          this.web3.eth.sendSignedTransaction(rawTx, (err, hash) => {
            if (err) {
              ob.error(err.message);
            } else {
              //update balance token
              ob.next(hash)
              console.log("hash: " + hash)
              Contract.methods.balanceOf(this.authService.address).call().then(bl => {
                console.log('balance affter send: ' + bl);
              })

            }
          }).catch(err => {
            console.log('cacth: ' + err.message)
          })
        })
      })
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

  getAddressFromPrivateKey(privateKey): Observable<any> {
    var account = this.web3.eth.accounts.privateKeyToAccount("0x" + privateKey);
    return new Observable(ob => {
      ob.next(account.address);
    })
  }

  send(address: string, nty: number, password: string, exData?: string): Observable<any> {
    // check password
    if (!this.authService.validatePassword(password)) {
      return Observable.throw("Invalid local passcode");
    }

    // check address
    if (!this.web3.utils.isAddress(address)) {
      return Observable.throw("Invalid address");
    }

    // let sendValue = Constants.BASE_NTY.valueOf() * nty;
    let sendValue = Constants.BASE_NTY2.valueOf() * nty;
    let hexValue = '0x' + bigInt(sendValue).toString(16);
    console.log("hexValue= " + hexValue, "sendValue= " + bigInt(sendValue).toString(), 'decValue= ' + parseInt(hexValue, 16) / Constants.BASE_NTY, nty)
    // let sendValue2 = Constants.BASE_NTY * nty;
    // let hexValue2 = '0x'+ sendValue2.toString(16);
    // console.log('hexvalue2= '+hexValue2,'sendvalue2= '+sendValue2, 'sendtohex=' +sendValue2.toString())
    let txData: Tx
    if (exData || exData != null) {
      txData = {
        from: this.authService.address,
        to: address,
        value: hexValue,
        data: exData
      };
    } else {
      txData = {
        from: this.authService.address,
        to: address,
        value: hexValue
      };
    }

    return Observable.fromPromise(
      this.web3.eth.getTransactionCount(this.authService.address))
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
                console.log("error: " + error.message + "-", error, "err2" + JSON.stringify(error))
              } else {
                // update balance
                this.updateBalance().subscribe(() => {
                  observer.next(hash);
                });
              }
            }).catch(err => {
              // ignore error
              console.log("catch: " + err.message, JSON.stringify(err));
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
