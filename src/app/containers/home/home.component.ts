import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
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
export class HomeComponent implements OnInit,AfterViewInit {
  isVisibleInView = true;
  observer: IntersectionObserver;
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
  @ViewChild('navbar', { read: ElementRef, static:false }) navbar: ElementRef;
  //@ViewChild('smallModal') public smallModal: ModalDirective;
  @ViewChild('header',{ read: ElementRef, static:false }) header: ElementRef;
  constructor(private fireAuth: FireLoginService,private renderer: Renderer2) {
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

  ngAfterViewInit() {
    this.observer = new IntersectionObserver( entries => {
      if ( entries[0].isIntersecting === true ) {
        this.isVisibleInView = true;
        this.navbar.nativeElement.classList.remove('dark-nav')
    
      } else {
        this.navbar.nativeElement.classList.add('dark-nav')
        this.isVisibleInView = false;
      }
    }, {
      threshold: 1
    });

    this.observer.observe(this.header.nativeElement as HTMLElement);
  }

  logout(){
    
    this.loggedIn=false;
    this.fireAuth.fireLogout();
  }
}
