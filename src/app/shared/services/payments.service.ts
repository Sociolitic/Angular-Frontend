import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { server } from '../constants';
import { User } from '../models/user.model';
import { FireLoginService } from './fire-login.service';

declare const Stripe;
@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private _http:HttpClient, private auth:FireLoginService,private router: Router) { }
  checkout(plan:string){
    console.log(plan);
    const user:User= this.auth.getUser();
    const headers: HttpHeaders=new HttpHeaders().set("Content-Type", "application/json");
    const body= {
      'email': user.email,
      'photo': user.photo,
      'plan':plan
    }
    console.log(body);
    this._http.post(server+'/pay/stripe/create-checkout-session', body,{headers:headers}).subscribe(
      session => this.redirectToCheckout(session),
      err => console.log(err)
    )
  }
  async redirectToCheckout(session:any){
    console.log(session);
    var stripe= Stripe('pk_test_51HJE3RGX3LiFGzdnbkkeuOOHWoT3cR3HjadPMBGA7ftisLj0iihOIWbI9EqQZP7H65Dd0ElkgwhJ7y8jKdjQt8Ob00bbCbdUAY');
    stripe.redirectToCheckout({
      sessionId:session.id
    }).then(function (result) {
      // If redirectToCheckout fails due to a browser or network
      // error, you should display the localized error message to your
      // customer using error.message.
      if (result.error) {
      alert(result.error.message);
      }
    });
  }

  dummycheckout(plan:string){
    const user:User= this.auth.getUser();
    const headers: HttpHeaders=new HttpHeaders().set("Content-Type", "application/json");
    const body= {
      'email': user.email,
    }
    this._http.get(server+"/webhook/testConfirm/"+user.email,{responseType:'text'}).subscribe(
      (response)=>{
        this.router.navigate(["default", "dashboard"]);
      },
      err=> console.log(err)
    );

  }
}
