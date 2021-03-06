import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ChartsModule } from 'ng2-charts';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AlertController } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { Deeplinks } from '@ionic-native/deeplinks';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoadingService } from "../services/loading.service";
import { UnloginPage } from "../pages/unlogin/unlogin";
import { LoginPage } from "../pages/login/login";
import { RegisterPage } from "../pages/register/register";
import { DashboardPage } from "../pages/dashboard/dashboard";
import { TransactionDetailPage } from "../pages/detail/detail";
import { BackupPage } from "../pages/backup/backup";
import { AboutPage } from "../pages/about/about";
import { SettingPage } from "../pages/setting/setting";
import { HistoryPage } from "../pages/history/history";
import { RequestPage } from "../pages/request/request";
import { SendPage } from "../pages/send/send";
import { DashboardService } from "../pages/dashboard/dashboard.service";
import { HistoryService } from "../pages/history/history.service";
import { WalletService } from "../services/wallet.service";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { SocialSharing } from "@ionic-native/social-sharing";
import { IonicStorageModule } from "@ionic/storage";
import { DataService } from "../services/data.service";
import { AuthService } from "../services/auth.service";
import { RateService } from "../services/rate.service";
import { HttpClientModule } from "@angular/common/http";
import { DetailService } from "../pages/detail/detail.service";
import { BackupService } from "../pages/backup/backup.service";
import { RestorePage } from "../pages/restore/restore";
import { RestoreService } from "../pages/restore/restore.service";
import { SuperTabsModule } from "ionic2-super-tabs";
import { File } from '@ionic-native/file';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { Network } from '@ionic-native/network';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { RedeemPage } from '../pages/redeem/redeem';
import { FcmService } from '../services/fcm.service';
import { Firebase } from '@ionic-native/firebase';
import { DetailNotiPage } from '../pages/detail-noti/detail-noti';
import { NotificationsPage } from '../pages/notifications/notifications';
import { PrivateKeyPage } from '../pages/private-key/private-key';
import { SmartContractPage } from '../pages/smart-contract/smart-contract';
import { PopoverComponent } from '../components/popover/popover';

@NgModule({
  declarations: [
    MyApp,
    /* Pages */
    HomePage,
    UnloginPage,
    LoginPage,
    RegisterPage,
    DashboardPage,
    TransactionDetailPage,
    BackupPage,
    AboutPage,
    SettingPage,
    HistoryPage,
    RequestPage,
    RestorePage,
    SendPage,
    RedeemPage,
    NotificationsPage,
    DetailNotiPage,
    PrivateKeyPage,
    SmartContractPage,
    PopoverComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      'backButtonText': ''
    }),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    ChartsModule,
    NgxQRCodeModule,
    SuperTabsModule.forRoot(),
    SlimLoadingBarModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    /* Pages */
    HomePage,
    UnloginPage,
    LoginPage,
    RegisterPage,
    DashboardPage,
    TransactionDetailPage,
    BackupPage,
    AboutPage,
    SettingPage,
    HistoryPage,
    RequestPage,
    RestorePage,
    SendPage,
    RedeemPage,
    NotificationsPage,
    DetailNotiPage,
    PrivateKeyPage,
    SmartContractPage,
    PopoverComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LoadingService,
    DataService,
    AuthService,
    RateService,
    WalletService,
    Clipboard,

    /* Page services */
    DashboardService,
    HistoryService,
    DetailService,
    BackupService,
    RestoreService,
    FcmService,

    /* Other providers*/
    Deeplinks,
    BarcodeScanner,
    SocialSharing,
    InAppBrowser,
    AlertController,
    Clipboard,
    File,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    IOSFilePicker,
    FileChooser,
    FilePath,
    Network,
    Firebase
  ]
})
export class AppModule {
}
