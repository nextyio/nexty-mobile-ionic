import { CommonService } from "../../helper/common.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { LoadingService } from "../../services/loading.service";
import 'rxjs/add/operator/delay';
import { RateService } from "../../services/rate.service";
import { WalletService } from "../../services/wallet.service";
import { Utils } from "../../helper/utils";
import { Constants } from "../../helper/constants";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class DashboardService extends CommonService {

  balance: number;

  rateHistory: Array<{
    date: string,
    price: number
  }>;

  constructor(loadingService: LoadingService,
    private http: HttpClient,
    private rateService: RateService,
    private walletService: WalletService) {
    super(loadingService);
  }

  getData(): Observable<any> {
    this.balance = 0;
    this.rateHistory = [];

    return Observable.forkJoin(
      this.rateService.initData(),
      this.walletService.updateBalance()
    );
  }
}
