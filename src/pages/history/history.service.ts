import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/delay';
import { HttpClient } from "@angular/common/http";
import { Constants } from "../../helper/constants";
import { AuthService } from "../../services/auth.service";
import { HistoryModel } from "./history.model";
import * as moment from "moment";

@Injectable()
export class HistoryService {

  historyData: Array<HistoryModel> = [];

  constructor(private http: HttpClient,
    private authService: AuthService) {
  }

  getData(start: number = 0, length: number = 20): Observable<any> {
    let data = {
      addr: this.authService.address,
      start: start,
      length: length
    };
    return this.http.post(Constants.EXPLORER_API + "/his", data).map(response => {
      if (response instanceof Array) {
        this.historyData = [];
        for (let entry of response) {
          let historyEntry = new HistoryModel();
          historyEntry.tx = entry[0];
          historyEntry.blockNumber = entry[1];
          historyEntry.from = entry[2];
          historyEntry.to = entry[3];

          let value = +entry[4];
          if (!isNaN(value)) {
            historyEntry.value = value;
          } else {
            historyEntry.value = 0;
          }
          historyEntry.time = moment.unix(entry[6]);

          this.historyData.push(historyEntry);
        }
      }
    })
  }
}
