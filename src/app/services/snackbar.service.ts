import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private message = new Subject<string>();
  constructor() { }

  getSnackBarMessage(): Observable<string> {
    return this.message;
  }

  setSnackBarMessage(msg: string) {
    this.message.next(msg);
  }
}
