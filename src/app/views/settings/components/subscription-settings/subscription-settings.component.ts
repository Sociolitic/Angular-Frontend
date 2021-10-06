import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { User } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-subscription-settings',
  templateUrl: './subscription-settings.component.html',
  styleUrls: ['./subscription-settings.component.scss']
})
export class SubscriptionSettingsComponent implements OnInit {
  
  selected=1;
  constructor() { }

  ngOnInit(): void {
    const user: User= JSON.parse(localStorage.getItem('user'));
    if(user.plan=='pro')
      this.selected=2
    else if(user.plan=='tier 2')
      this.selected=3
  }
  

}
