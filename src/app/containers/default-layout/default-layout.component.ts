import {Component} from '@angular/core';
import { navItems } from '../../_nav';
import { OnInit } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { Router } from '@angular/router';
import { FireLoginService } from '../../shared/services/fire-login.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls:['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit{
  public sidebarMinimized = false;
  public navItems = navItems;
  public isMenuCollapsed = true;
  user:User;
  constructor(private router: Router ,private fireAuth: FireLoginService){}
  ngOnInit(){
    this.user = JSON.parse(localStorage.getItem('user'));
    this.fireAuth.fetchDetails(this.user.bearer).subscribe(
      (res:User) => {
        console.log(res);
        let user = res;
        user.bearer = this.user.bearer;
        localStorage.setItem("user", JSON.stringify(user));
        this.user=user;
        if (user.stage == 1) {
          this.router.navigate(["subscriptions"]);
        }
      },
      (err) => console.log("HTTP Error in FETCH", err)
    );
    console.log(this.user.name);
  }
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  logout(){
    this.fireAuth.fireLogout();
    // localStorage.clear();
    // this.router.navigate(['../../home']);
  }
}
