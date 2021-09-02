import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StatisticsData } from '../models/graphs.model';
import {server,localhost} from '../constants';
import { FireLoginService } from './fire-login.service';
@Injectable({
  providedIn: 'root'
})
export class ChartDataService {

  constructor(private http: HttpClient,private fireAuth: FireLoginService) { }
  getChartData(profileId:string):Observable<StatisticsData>{
    console.log(profileId)
    const bearer:string = this.fireAuth.getBearer();
    const headers = new HttpHeaders().set("Authorization", "Bearer "+bearer);
    const params = new HttpParams().set('q',profileId);
    const options ={
      headers:headers,
      params: params
    }
    return this.http.get<StatisticsData>(server+'/data/aggregate',options);
  }

  labels(period,years=null):string[]{
    let index=24;
    let tag='hour ';
    switch(period){
      case 'daily ':{
        index=30;
        tag='day';
        break;
      }
      case 'monthly':{
        index=12;
        tag='month ';
        break;
      }
      case 'yearly':{
        index=5;
        tag='year ';
        break;
      }
      default: break;
    }
    let res=[];
    for(let i=1;i<=index;i++)
      res.push(tag+i);
    return res;
  }
}
