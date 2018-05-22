import {EventEmitter, Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {ISubscription} from "rxjs/Subscription";
import "rxjs/add/observable/interval";
import {HttpClient} from "@angular/common/http";
import {Constants} from "../helper/constants";
import {Utils} from "../helper/utils";

@Injectable()
export class RateService {

  rateHistory: Array<{
    date: string,
    price: number
  }>;
  rateHistoryUpdated = new EventEmitter<any>();
  private rateHistorySubscription: ISubscription;

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
      this.getRateHistoryData()
    ]).map(() => {
      this.rateUpdated.emit();
      this.rateHistoryUpdated.emit();
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

  stopRateRecurring() {
    this.rateSubscription.unsubscribe();
  }

  startRateHistoryRecurring() {
    this.rateHistorySubscription = Observable.interval(Constants.TIMER_UPDATE_GRAPH)
      .subscribe(() => {
        this.getRateHistoryData().subscribe(() => {
          this.rateUpdated.emit();
        });
      });
  }

  stopRateHistoryRecurring() {
    this.rateHistorySubscription.unsubscribe();
  }

  private getRateData(): Observable<any> {
    return this.http.get(Constants.SERVICE_API + '/api/getLastPrice')
      .map((res) => {
        if (res != undefined) {
          let rate = res['lastPrice'];
          if (rate != undefined && !isNaN(rate)) {
            this.rate = Utils.round(rate, 2);
          }
        }
      });
  }

  private getRateHistoryData(): Observable<any> {
    return this.http.get(Constants.SERVICE_API + '/api/getExchangerate')
      .map((res) => {
        if (res instanceof Array && res.length > 0) {
          this.rateHistory = [];
          for (let entry of res) {
            let date = entry['dateTime'];
            let price = Utils.round(entry['price'], 2);

            this.rateHistory.push({
              date: date,
              price: price
            })
          }

          this.rateHistory = this.rateHistory.reverse();
        }
      });
  }
}
