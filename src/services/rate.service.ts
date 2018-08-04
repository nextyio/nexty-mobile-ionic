import { EventEmitter, Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { ISubscription } from "rxjs/Subscription";
import "rxjs/add/observable/interval";
import { HttpClient } from "@angular/common/http";
import { Constants } from "../helper/constants";

@Injectable()
export class RateService {

  rateHistory: Array<{
    date: string,
    price: number
  }>;
  rateHistoryUpdated = new EventEmitter<any>();
  rate: number;
  rateUpdated = new EventEmitter<any>();

  private rateSubscription: ISubscription;

  constructor(public http: HttpClient) {
    this.rateHistory = [];
    this.rate = 0;
  }

  initData(): Observable<any> {
    return Observable.forkJoin([
      this.getRateData(),
    ]).map(() => {
      this.rateUpdated.emit();
    });
  }

  startRateRecurring() {
    this.rateSubscription = Observable.interval(Constants.TIMER_UPDATE_RATE)
      .subscribe(() => {
        this.getRateData().subscribe(() => {
          this.rateUpdated.emit();
        });
      });
  }

  private getRateData(): Observable<any> {
    return this.http.get(Constants.GETUSD)
      .map((res) => {
        if (res != undefined) {
          let rate = res['data'].quotes.USD.price;
          if (rate != undefined && !isNaN(rate)) {
            // this.rate = Utils.round(rate, 2);
            this.rate = rate;
          }
        }
      });
  }

}
