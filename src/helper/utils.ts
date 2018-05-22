export class Utils {
  static round(input: number, precision: number = 0): number {
    let p = 10 ** precision;
    return Math.round(input * p) / p;
  }

  static generateRandom(len: number): string {
    let arr = new Uint8Array((len || 40) / 2);
    crypto.getRandomValues(arr);
    return Array.from(arr, Utils.dec2hex).join('')
  }

  // dec2hex :: Integer -> String
  static dec2hex(dec) {
    return ('0' + dec.toString(16)).substr(-2);
  }
}
