import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  constructor() { }
  displayDate(date:any){
    if(typeof date == 'string'){
      date= new Date(date) ;
    }
    return date.toLocaleString('en-GB');
  }
}
