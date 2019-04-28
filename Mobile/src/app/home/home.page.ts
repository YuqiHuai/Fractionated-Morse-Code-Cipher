import { Component } from '@angular/core';
import { FMCService } from '../services/fmc.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  msg = '';
  emsg = '';
  keyphrase = '';

  constructor(private fmc: FMCService) { }

  encrypt() {
    this.emsg = this.fmc.FMCEncrypt(this.msg, this.keyphrase);
  }

  decrypt() {
    this.msg = this.fmc.FMCDecrypt(this.emsg, this.keyphrase);
  }
}
