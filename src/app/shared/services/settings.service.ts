import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserSettingsComponent } from '../../views/settings/components/user-settings/user-settings.component';
import { User } from '../models/user.model';
import { server } from '../constants';
@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private _http: HttpClient) { }
  updateAlerts(alerts:boolean,reports: boolean,newsletters: boolean){
    const user: User=JSON.parse(localStorage.getItem('user'));
    const body ={
      'user': user.userId,
      'alerts':alerts,
      'reports': reports,
      'newsletters':newsletters
    }
    this._http.post(server+'/auth/update',body);
  }
}
