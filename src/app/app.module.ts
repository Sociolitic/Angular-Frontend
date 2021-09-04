import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';
import {MatIconModule} from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { MatTabsModule } from '@angular/material/tabs';
import { AngularTypewriterEffectModule } from 'angular-typewriter-effect';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { MDBBootstrapModule } from 'angular-bootstrap-md';


import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { NavbarsComponent } from './views/base/navbars/navbars.component';
const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

const config={
  apiKey: "AIzaSyDrqOimL_5FP7CnyT0BKpAbPVI471y1QqM",
        authDomain: "sociolitic.firebaseapp.com",
        projectId: "sociolitic",
        storageBucket: "sociolitic.appspot.com",
        messagingSenderId: "1075477400639",
        appId: "1:1075477400639:web:d9fd5e9024dc03759ffc8a",
        measurementId: "G-VYNRYTD9W3"
};

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { HomeComponent } from './containers/home/home.component';
import { AnalysisReportComponent } from './views/analysis-report/analysis-report.component';
import { SettingsComponent } from './views/settings/settings.component';
import { BrandSelectComponent } from './views/brand-select/brand-select.component';
import { UserSettingsComponent } from './views/settings/components/user-settings/user-settings.component';
import { ProfileDialog, ProfileSettingsComponent } from './views/settings/components/profile-settings/profile-settings.component';
import { SubscriptionSettingsComponent } from './views/settings/components/subscription-settings/subscription-settings.component';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoginPageComponent } from './login-page/login-page.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    IconModule,
    IconSetModule.forRoot(),
    MatButtonModule,
    MatIconModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule,
    HttpClientModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    NgbModule,
    ModalModule,
    CarouselModule,
    MatTabsModule,
    MatCardModule,
    AngularTypewriterEffectModule,
    MDBBootstrapModule.forRoot(),
    MatCheckboxModule,
    MatExpansionModule,
    MatMenuModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatToolbarModule,
    MatDialogModule,
    MatDividerModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    NavbarsComponent,
    AnalysisReportComponent,
    SettingsComponent,
    BrandSelectComponent,
    UserSettingsComponent,
    ProfileSettingsComponent,
    SubscriptionSettingsComponent,
    LoginPageComponent,
    ProfileDialog
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    IconSetService,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
