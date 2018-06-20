import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/finally";
import { LoadingService } from "../services/loading.service";

export abstract class CommonService {

  constructor(private cLoadingService: LoadingService) {
  }

  abstract getData(): Observable<any>;

  load(): void {
    console.log("load data");
    this.cLoadingService.showLoading();
    this.getData().finally(() => {
      this.cLoadingService.hideloading();
    }).subscribe();
    setTimeout(() => {
      this.cLoadingService.hideloading();
    }, 5000);
  }
}
