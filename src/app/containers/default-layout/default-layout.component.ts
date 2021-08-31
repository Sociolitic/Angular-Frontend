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
  user:User;
  constructor(private router: Router ,private fireAuth: FireLoginService){}
  ngOnInit(){
    this.user = JSON.parse(localStorage.getItem('user'));
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
