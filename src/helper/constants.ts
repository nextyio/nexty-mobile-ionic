import bigInt from "big-integer";
export class Constants {

  /* static */
  static readonly SERVICE_API = 'https://app.nexty.io';
  static readonly WEB3_API = 'http://13.228.68.50:8545';
  static readonly EXPLORER_API = 'https://explorer.nexty.io';
  static readonly WALLET_API = 'https://dev-wallet.nexty.io';
  static readonly BASE_PNTY = Math.pow(10, 22);
  static readonly BASE_NTY = Math.pow(10, 18);
  static readonly PNTY_NTY = 10000;
  static readonly BASE_NTY2 = bigInt(10).pow(18);

  /* settings */
  static readonly TIMER_UPDATE_RATE = 120000; // 1'
  static readonly TIMER_UPDATE_GRAPH = 120000; // 2'
  static readonly TIMER_UPDATE_BALANCE = 5000; // 5s
  static readonly CONFIRM_DELAY = 10; // 10s

  /* const */
  static readonly PASSWORD_PATTERN = /^.{6,}$/;
  /*API data COINMARKETCAP */
  static readonly COINMARKETCAP = 'https://graphs2.coinmarketcap.com/currencies/nexty/';
  static readonly WEEK = 653600000;
  static readonly DAY = 86400000;
  static readonly GETUSD = 'https://api.coinmarketcap.com/v2/ticker/2714/';
}
