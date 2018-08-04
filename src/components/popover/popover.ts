import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { DataService } from '../../services/data.service';

/**
 * Generated class for the PopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {

  ListContract: any;
  constructor(
    public ViewCtr: ViewController,
    private dataservice: DataService,
  ) {
    this.ListContract = [{
      'tokenAddress': null,
      'balance': null,
      'symbol': 'NTY',
      'decimal': null,
      'ABI': null
    }]
    this.dataservice.getToken().subscribe(token => {
      if (token != null) {
        var ArrTk = JSON.parse(token);
        ArrTk.forEach(element => {
          this.ListContract.push(element)
        });
      }
    })
  }
  SelectContract(item) {
    this.ViewCtr.dismiss(item)
  }

}
