import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  constructor() { }
  displayDate(date:Date){
    return date.toLocaleString('en-GB');
  }
}
