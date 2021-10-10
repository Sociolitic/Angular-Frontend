import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { config } from 'process';
import { User } from '../models/user.model';
import { FireLoginService } from './fire-login.service';
import { server,localhost } from '../constants';
@Injectable({
  providedIn: 'root'
})
export class BrandRegistrationService {
  constructor(private _http: HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar,
    private fireAuth: FireLoginService
    ) { }
  registerBrand(brand:string,competitors:string[]){
    let user:User = JSON.parse(localStorage.getItem("user"));
    const token:string = user.bearer;
    const headers= new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("Authorization","Bearer "+token);
    const body={
    "brand": brand,
    "competitors":competitors.join(',')
    }
    console.log(body);
    this._http.post(server+"/brand/createProfile",body,{ headers:headers,responseType:'text' }).subscribe(
      res =>{
        this.fireAuth.fetchDetails(token).subscribe(
          (res:User) =>{
            user = res;
            user.bearer=token;
            localStorage.setItem('user',JSON.stringify(user));
            this._snackBar.open('Brand Registration Successful!',null,{duration: 3000});
            this.router.navigate(['default','dashboard']);
          },
          (err) => {
            console.log("HTTP Error in FETCH", err)
            this._snackBar.open('User Authentication failed',null,{duration: 3000});
          }
        )       
      },
      error =>{
        console.log(error);
        this._snackBar.open('Brand Registration Failed',null,{duration: 3000});
      }
    )
  }

  findProfiles(ids:string[],bearer:string){
    const header: HttpHeaders = new HttpHeaders()
    .set("Authorization","Bearer "+bearer);
    const body ={
      "profiles":ids
    }
    return this._http.post(server+'/brand/findProfiles',body,{headers: header});
  }

  createProfile(brand:string,competitors:string[]){
    let user:User = JSON.parse(localStorage.getItem("user"));
    const token:string = user.bearer;
    const headers= new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("Authorization","Bearer "+token);
    const body={
    "brand": brand,
    "competitors":competitors.join(',')
    }
    console.log(body);
    return this._http.post(server+"/brand/createProfile",body,{ headers:headers,responseType:'text' })
  }
  deleteProfile(profile:string){
    let user:User = JSON.parse(localStorage.getItem("user"));
    const token:string = user.bearer;
    const headers= new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("Authorization","Bearer "+token);
    const body={
      "id":profile
    }
    console.log(body);
    return this._http.post(server+"/brand/deleteProfile",body,{ headers:headers,responseType:'text' })
  }
}
