import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StatisticsData } from '../models/graphs.model';
import {server,localhost} from '../constants';
@Injectable({
  providedIn: 'root'
})
export class ChartDataService {

  constructor(private http: HttpClient) { }
  getDailyData():Observable<StatisticsData>{
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.get<StatisticsData>(server+'/data/aggregate?q=Tesla');
  }

}
