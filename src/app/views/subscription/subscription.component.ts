import { Component, OnInit } from '@angular/core';
import { PaymentsService } from '../../shared/services/payments.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  constructor(private stripeCheckout: PaymentsService) { }

  ngOnInit(): void {
  }
  checkout(plan:string){
    this.stripeCheckout.dummycheckout(plan);
  }
}
