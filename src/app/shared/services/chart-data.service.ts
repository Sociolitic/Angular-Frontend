import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StatisticsData } from '../models/graphs.model';
import {server} from '../constants';
import { FireLoginService } from './fire-login.service';
@Injectable({
  providedIn: 'root'
})
export class ChartDataService {

  constructor(private http: HttpClient,private fireAuth: FireLoginService) { }
  getChartData(profileId:string):Observable<any>{
    console.log(profileId)
    const bearer:string = this.fireAuth.getBearer();
    const headers = new HttpHeaders().set("Authorization", "Bearer "+bearer);
    const params = new HttpParams().set('q',profileId);
    const options ={
      headers:headers,
      params: params
    }
    return this.http.get<any>(server+"/data/aggregate-count",options);
  }

  labels(period:string,length:number):string[]{
    console.log(period);
    let res=[];
    let currentDate:Date = new Date();
    switch(period){
      case 'mins':{
        for( let i=0;i<length;i++){
          res.push(''+i);
        }
        break;
      }
      case 'hours':{
        for( let i=0;i<length;i++){
          res.push(''+i);
        }
        break;
      }
      case 'days':{
        for( let i=0;i<length;i++){
          res.push(''+i);
        }
        break;
      }
      case 'months':{
        for( let i=0;i<length;i++){
          res.push(''+i);
        }
        break;
      }
      case 'years':{
        for( let i=0;i<length;i++){
          res.push(''+i);
        }
        break;
      }
      default: break;
    }
    console.log(res);
    return res;
  }

  subtractPeriod(currentdate:Date,period:string,sub:number):string{
    let date= new Date(currentdate);
    switch(period){
      case 'hourly':{
        return (new Date(date.setHours(date.getHours()-sub))).toLocaleString('en-GB');
      }
      case 'daily':{
        return (new Date(date.setDate(date.getDate()-sub))).toLocaleString('en-GB');
      }
      case 'monthly':{
        return (new Date(date.setMonth(date.getMonth()-sub))).toLocaleString('en-GB');
      }
      case 'yearly':{
        return (new Date(date.setFullYear(date.getFullYear()-sub))).toLocaleString('en-GB');
      }
      default: return date.toLocaleString();
    }
  }
}
