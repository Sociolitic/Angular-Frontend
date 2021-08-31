import { Component, OnInit } from '@angular/core';
import { User } from '../../../../shared/models/user.model';
import { SettingsService } from '../../../../shared/services/settings.service';
@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  alerts:boolean;
  reports:boolean;
  newsletters:boolean;
  constructor(private _settingsvc: SettingsService) { }

  ngOnInit(): void {
    const user: User= JSON.parse(localStorage.getItem('user'));
    this.alerts= user.alerts;
    this.reports=user.reports;
    this.newsletters=user.newsletters;
  }
  updateAlerts(){
    this._settingsvc.updateAlerts(this.alerts,this.reports,this.newsletters);
  }

}
