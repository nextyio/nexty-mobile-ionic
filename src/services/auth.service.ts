import { Injectable } from "@angular/core";
import { DataService } from "./data.service";
import { Observable } from "rxjs/Observable";
import * as CryptoJS from "crypto-js";
import keythereum from 'keythereum'
import "rxjs/add/observable/of";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import "rxjs/add/observable/forkJoin";
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import moment from 'moment';
import { Platform } from "ionic-angular";
import { LoadingService } from "./loading.service";


@Injectable()
export class AuthService {

  isAuth: boolean;
  address: string;
  privateKey: string;
  cachePwd: string;
  public keystore;
  public urlFile: string;
  public namefile: string;
  constructor(
    private dataService: DataService,
    private storage: Storage,
    private socialSharing: SocialSharing,
    private filePath: FilePath,
    public platform: Platform,
    private file: File,
    private loadingService: LoadingService,

  ) {
  }

  initAuth(): Observable<any> {
    return Observable.forkJoin([
      this.dataService.checkAuth(),
      this.dataService.getCurrent()
    ]).mergeMap((data: any[]) => {
      this.isAuth = data[0];
      this.address = data[1];

      if (this.isAuth) {
        return Observable.forkJoin([
          this.dataService.getAddressPK(this.address),
          this.dataService.getAddressPwd(this.address)
        ]).map(data => {
          this.privateKey = data[0];
          this.cachePwd = data[1];
          // let priv = this.getPrivateKey('123455')
          // console.log('priv:' + priv)
        });
      } else {
        return Observable.of(0);
      }
    });
  }

  login(address: string, password: string): Observable<any> {
    //console.log(this.getPrivateKey(password))
    // encrypt password
    password = AuthService.encryptPassword(password);

    // validate
    return this.dataService.getAddressPwd(address)
      .mergeMap(pwd => {
        console.log('sds: ' + pwd);
        if (password != pwd) {
          return Observable.throw('err');
        }
        return this.dataService.getAddressPK(address);
      }).mergeMap(pk => {
        this.address = address;
        this.privateKey = pk;
        this.cachePwd = password;
        return Observable.forkJoin([
          this.dataService.setCurrent(address),
          this.dataService.setAuth(true)
        ]);
      });
  }

  logout(): Observable<any> {
    return this.dataService.setAuth(false);
  }

  register(password: string): Observable<any> {
    // generate address
    let key = keythereum.create();
    var options = {
      kdf: "pbkdf2",
      cipher: "aes-128-ctr",
      kdfparams: {
        c: 262144,
        dklen: 32,
        prf: "hmac-sha256"
      }
    };
    keythereum.dump(password, key['privateKey'], key['salt'], key['iv'], options, (keyObject) => {
      console.log('aaaa', keyObject);
      // create name keystore
      var dateTime = new Date();
      let name = 'keystore--' + moment().format('YYYY-MM-DD') + '-' + dateTime.getTime() + '--' + this.address + '.json';
      // save file keystore 
      // var dataFile = { "code-nexty": this.service.code }
      if (this.platform.is('android')) {
        // console.log("content: " + JSON.stringify(dataFile));
        this.file.writeFile(this.file.externalDataDirectory, name, JSON.stringify(keyObject) + '').then(res => {
          this.urlFile = res.nativeURL;
          var newPath = this.urlFile.substr(0, this.urlFile.lastIndexOf('/And') + 1);
          this.file.checkDir(newPath, 'BackupNexty').then(exists => {
            if (!exists) {
              this.file.createDir(newPath, "BackupNexty", false).then(path => {
                console.log("path:", path, JSON.stringify(path))
                this.file.writeFile(path.nativeURL, name, JSON.stringify(keyObject) + '').then(resfile => {
                  this.loadingService.showToat('save file: ' + resfile.nativeURL);
                })
                var pathOld = this.urlFile.substr(0, this.urlFile.lastIndexOf('/') + 1)
              })
            } else {

              this.file.writeFile(newPath + 'BackupNexty/', name, JSON.stringify(keyObject) + '').then(resfile => {
                this.loadingService.showToat('save file: ' + resfile.nativeURL);
              })
            }
          })

        }).catch(err => {
          console.log(err);
        })
      } else if (this.platform.is('ios')) {
        this.file.writeFile(this.file.tempDirectory, name, JSON.stringify(keyObject) + '')
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

    });

    // this.storage.set('key', keyOject);
    let privateKeyBuffer = key['privateKey'];
    let address = keythereum.privateKeyToAddress(privateKeyBuffer);
    let privateKey = privateKeyBuffer.toString('hex');
    console.log(privateKey)
    this.storage.set('keyObject', key);
    // return Observable.forkJoin([
    //   this.restore(address, privateKey, password),
    //   this.getkeystore(password, key, address)
    // ])
    return this.restore(address, privateKey, password)
  }

  restore(address: string, privateKey: string, password: string): Observable<any> {
    // encrypt password, pk
    privateKey = CryptoJS.AES.encrypt(privateKey, password).toString();
    password = AuthService.encryptPassword(password);

    return Observable.forkJoin([
      this.dataService.addAddress(address, password, privateKey),
      this.dataService.setCurrent(address)
    ]).map(() => {
      this.address = address;
      this.privateKey = privateKey;
      console.log('private: ' + this.privateKey)
      this.cachePwd = password;
    });
  }

  validatePassword(password: string): boolean {
    return (this.cachePwd == AuthService.encryptPassword(password));
  }

  changePassword(oldPwd: string, newPwd: string): Observable<any> {
    // encrypt password
    oldPwd = AuthService.encryptPassword(oldPwd);
    newPwd = AuthService.encryptPassword(newPwd);

    return this.dataService.getAddressPwd(this.address)
      .mergeMap(pwd => {
        if (oldPwd != pwd) {
          return Observable.throw('Old password invalid');
        }

        let oldPk = CryptoJS.AES.decrypt(this.privateKey, oldPwd).toString(CryptoJS.enc.Utf8);
        let newPk = CryptoJS.AES.encrypt(oldPk, newPwd).toString();

        return this.dataService.addAddress(this.address, newPwd, newPk).map(() => {
          this.privateKey = newPk;
          this.cachePwd = newPwd;
        });
      });
  }

  getPrivateKey(password: string): string {
    return CryptoJS.AES.decrypt(this.privateKey, password).toString(CryptoJS.enc.Utf8);
  }

  private static encryptPassword(password: string): string {
    return CryptoJS.MD5(password).toString(CryptoJS.enc.Hex);
  }
}
