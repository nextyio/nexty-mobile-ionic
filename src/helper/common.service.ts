import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/finally";
import {LoadingService} from "../services/loading.service";

export abstract class CommonService {

  constructor(private cLoadingService: LoadingService) {
  }

  abstract getData(): Observable<any>;

  load(): void {
    console.log("load data");
    this.cLoadingService.show();
    this.getData().finally(() => {
      this.cLoadingService.hide();
    }).subscribe();
    setTimeout(() => {
      this.cLoadingService.hide();
    }, 5000);
  }
}
