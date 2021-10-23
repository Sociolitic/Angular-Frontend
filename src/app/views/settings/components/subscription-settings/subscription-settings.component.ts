import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { User } from '../../../../shared/models/user.model';
import { PaymentsService } from '../../../../shared/services/payments.service';

@Component({
  selector: 'app-subscription-settings',
  templateUrl: './subscription-settings.component.html',
  styleUrls: ['./subscription-settings.component.scss']
})
export class SubscriptionSettingsComponent implements OnInit {
  
  selected=1;

  ngOnInit(): void {
    const user: User= JSON.parse(localStorage.getItem('user'));
    if(user.plan=='pro')
      this.selected=2
    else if(user.plan=='enterprise')
      this.selected=3
  }
  constructor(private stripeCheckout: PaymentsService) { }

 
  checkout(plan:number){
    this.stripeCheckout.dummycheckout(plan);
  }

}
