import {Moment} from "moment";

export class HistoryModel {
  tx: string;
  blockNumber: number;
  from: string;
  to: string;
  value: number;
  time: Moment;
}
