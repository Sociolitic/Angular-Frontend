import { Injectable } from '@angular/core';
import { CanActivate,CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../models/user.model';
import { FireLoginService } from './fire-login.service';
@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivateChild,CanActivate {

  constructor(private router: Router ,private Auth: FireLoginService) { }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let user:User=JSON.parse(localStorage.getItem('user'));
    if(!user){
      this.router.navigate(['login'])
      return false;
    }

    else {
      if(user.stage==1)
        this.router.navigate(['brand-select'])
      return true;
    }

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let user:User=JSON.parse(localStorage.getItem('user'));
    if(!user){
      this.router.navigate(['login'])
      return false;
    }

    else {
      return true;
    }

  }
}
