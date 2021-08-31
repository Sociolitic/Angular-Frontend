import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { User } from '../../shared/models/user.model';
import { FireLoginService } from '../../shared/services/fire-login.service';
import { sectionContents } from '../../shared/constants';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 1500, noPause: false } },
  ]
})
export class HomeComponent implements OnInit {
  contents=sectionContents;
  loggedIn = false;
  public isMenuCollapsed = true;
  slides: any[] = [];
  activeSlideIndex: number = 0;
  noWrapSlides: boolean = false;
  headerTextArray: string[] = [
    "Monitor social media mentions and opinions of your products.",
    "Backed up by powerful natural language processing models",
    "Bring forth key information from the data provided"
  ];

  @ViewChild('smallModal') public smallModal: ModalDirective;
  constructor(private fireAuth: FireLoginService) {
    for(let i=0;i<4;i++)
      this.addSlide();
   }

  addSlide(): void {
    setTimeout( () => {
      const seed = Math.random().toString(36).slice(-6);
      this.slides.push({
        image: `https://picsum.photos/seed/${seed}/900/500`
      });
    }, 500);
  }
  ngOnInit(): void {
    let user:User=JSON.parse(localStorage.getItem('user'));
    if(user){
      this.loggedIn=true;
    }
  }
  logout(){
    
    this.loggedIn=false;
    this.fireAuth.fireLogout();
  }
}
