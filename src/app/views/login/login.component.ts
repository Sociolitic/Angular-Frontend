import { Component } from '@angular/core';
import { FireLoginService } from '../../shared/services/fire-login.service';

@Component({
  selector: 'app-login',
  styleUrls:['login.component.scss'],
  templateUrl: 'login.component.html'
})
export class LoginComponent { 
  constructor(private authService: FireLoginService) { }

  signInWithGoogle(): void {
    this.authService.loginWithGoogle();
  }
}
