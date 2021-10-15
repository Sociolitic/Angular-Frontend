import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sicon',
  templateUrl: './social-icons.component.html',
  styleUrls: ['./social-icons.component.scss']
})
export class SocialIconsComponent implements OnInit {

  constructor() { }
  @Input('source') source='';
  ngOnInit(): void {
  }

}
