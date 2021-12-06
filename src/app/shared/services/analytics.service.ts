import { Injectable } from '@angular/core';
import {server} from '../constants';
import { FireLoginService } from './fire-login.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private http: HttpClient,private fireAuth: FireLoginService) { }
  startAggregate(profileId:string){
    console.log(profileId);
    const bearer:string = this.fireAuth.getBearer();
    const headers = new HttpHeaders().set("Authorization", "Bearer "+bearer);
    const params = new HttpParams().set('q',profileId);
    const options ={
      headers:headers,
      params: params
    }
    this.http.get<any>(server+"/data/aggregate",options).subscribe(
      res=>console.log(res),
      err => console.log(err)
    )
  }
  brandRecommendations(profileId:string){
    const bearer:string = this.fireAuth.getBearer();
    const headers = new HttpHeaders().set("Authorization", "Bearer "+bearer);
    //const params = new HttpParams().set('q',profileId).set('duration',''+duration);
    const options ={
      headers:headers,
      //params: params
    }
    return this.http.get<any>(server+"/analytics/recommend-brand",options);
  }

  competitorRecommendations(profileId:string){
    console.log(profileId);
    const bearer:string = this.fireAuth.getBearer();
    const headers = new HttpHeaders().set("Authorization", "Bearer "+bearer);
    const params = new HttpParams().set('q',profileId);
    const options ={
      headers:headers,
      params: params
    }
    return this.http.get<any>(server+"/analytics/recommend-competitor",options);
  }

  textAnalytics(profileId:string,duration:number){
    const bearer:string = this.fireAuth.getBearer();
    const headers = new HttpHeaders().set("Authorization", "Bearer "+bearer);
    const params = new HttpParams().set('q',profileId).set('duration',''+duration);
    const options ={
      headers:headers,
      params: params
    }
    return this.http.get<any>(server+"/analytics/text-analytics",options);
  }

  descriptiveAnalytics(profileId:string,duration:number){
    console.log("called");
    const bearer:string = this.fireAuth.getBearer();
    const headers = new HttpHeaders().set("Authorization", "Bearer "+bearer);
    const params = new HttpParams().set('q',profileId).set('duration',''+duration);
    const options ={
      headers:headers,
      params: params
    }
    return this.http.get<any>(server+"/analytics/desc-analytics",options);
  }

  aggregateText(profileId:string){
    const bearer:string = this.fireAuth.getBearer();
    const headers = new HttpHeaders().set("Authorization", "Bearer "+bearer);
    const params = new HttpParams().set('q',profileId);
    const options ={
      headers:headers,
      params: params
    }
    return this.http.get<any>(server+"/analytics/text-analytics-new",options);
  }
}
