import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FMCService {

  MorseCode = { '!': '-.-.--', '"': '.-..-.', '\'': '.----.', '(': '-.--.',
  ')': '-.--.-', ',': '--..--', '-': '-....-', '.': '.-.-.-',
  0: '-----', 1: '.----', 2: '..---', 3: '...--',
  4: '....-', 5: '.....', 6: '-....', 7: '--...',
  8: '---..', 9: '----.', ':': '---...', ';': '-.-.-.',
  '=': '-...-', '?': '..--..', '@': '.--.-.', A: '.-',
  B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.',
  G: '--.', H: '....', I: '..', J: '.---', K: '-.-',
  L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
  Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-',
  V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..' };
  CipherSequence = '.....-..x.-..--.-x.x..x-.xx-..-.--.x--.-----x-x.-x--xxx..x.-x.xx-.x--x-xxx.xx-';
  LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  constructor() { }

  toMorse(msg: string): string {
    let result = '';
    const preceed = {space: false, char: false};
    let i: number;
    msg = msg.toUpperCase();
    for (i = 0; i < msg.length; ++i) {
      if (msg[i] !== ' ' && this.MorseCode[msg[i]] !== undefined) {
        if (preceed.space) {
          result += 'xx';
          preceed.space = false;
        }
        if (preceed.char === true) {
          result += 'x';
        }
        result += this.MorseCode[msg[i]];
        preceed.char = true;
      } else if (msg[i] === ' ') {
        preceed.char = false;
        preceed.space = true;
      }
    }
    if (result !== '') {
      result += 'xx';
    }
    return result;
  }

  createKey(keyphrase: string): string {
    keyphrase = keyphrase.toUpperCase();
    let i: number;
    let result = '';
    for (i = 0; i < keyphrase.length; ++i) {
      if (this.LETTERS.indexOf(keyphrase[i]) !== -1 && result.indexOf(keyphrase[i]) === -1) {
        result += keyphrase[i];
      }
    }
    for (i = 0; i < this.LETTERS.length; ++i) {
      if (result.indexOf(this.LETTERS[i]) === -1) {
        result += this.LETTERS[i];
      }
    }
    return result;
  }

  morseToKey(mcmsg: string, key: string): string {
    if (mcmsg.length < 3) { return ''; }
    const target: string = mcmsg.substring(0, 3);
    let i: number;
    for (i = 0; i < 26; ++i) {
      const test: string = this.CipherSequence.substring(i * 3, i * 3 + 3);
      if (target === test) {
        return key[i];
      }
    }
    return '';
  }

  FMCEncrypt(msg: string, keyphrase: string): string {
    const mcmsg = this.toMorse(msg);
    const key = this.createKey(keyphrase);
    let i = 0;
    let result = '';
    while (true) {
      const char: string = this.morseToKey(mcmsg.substring(i * 3), key);

      if (char === '') { break; }
      result += char;
      i += 1;
    }
    return result;
  }

  fromMorse(mcmsg: string): string {
    let i: number;
    let anotherI: number;
    let token = '';
    let xCounter = 0;
    let result = '';
    const morseCodes = '!\'"(),-.0123456789:;=?@ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (i = 0; i < mcmsg.length; ++i) {
      if (mcmsg[i] === 'x') {
        xCounter += 1;
        if (xCounter === 2 && i !== mcmsg.length - 1) {
          result += ' ';
        }
        if (token !== '') {
          for (anotherI = 0; anotherI < morseCodes.length; ++anotherI) {
            if (this.MorseCode[morseCodes[anotherI]] === token) {
              result += morseCodes[anotherI];
              break;
            }
          }
          token = '';
        }
      } else {
        token += mcmsg[i];
        xCounter = 0;
      }
    }
    return result;
  }

  keyToMorse(emsg: string, keyphrase: string): string {
    let i: number;
    let result = '';
    for (i = 0; i < emsg.length; ++i) {
      const index = keyphrase.indexOf(emsg[i]);
      if (index !== -1) {
        result += this.CipherSequence.substring(index * 3, index * 3 + 3);
      }
    }
    while (result.substring(result.length - 2) !== 'xx') {
      result += 'x';
    }
    return result;
  }

  FMCDecrypt(emsg: string, keyphrase: string): string {
    emsg = emsg.toUpperCase();
    keyphrase = keyphrase.toUpperCase();
    const key = this.createKey(keyphrase);
    const mcmsg = this.keyToMorse(emsg, key);
    return this.fromMorse(mcmsg);
  }

}
