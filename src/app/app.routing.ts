import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Import Containers
import { DefaultLayoutComponent } from './containers';
import { HomeComponent } from './containers/home/home.component';
import { AnalysisReportComponent } from './views/analysis-report/analysis-report.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { AuthguardService } from './shared/services/authguard.service';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { SettingsComponent } from './views/settings/settings.component';
import { BrandSelectComponent } from './views/brand-select/brand-select.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SubscriptionComponent } from './views/subscription/subscription.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },

  {
    path: 'login',
    component: LoginPageComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'brand-select',
    component: BrandSelectComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'subscriptions',
    component: SubscriptionComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'default',
    component: DefaultLayoutComponent,
    canActivateChild: [AuthguardService],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: '',
        redirectTo:'dashboard',
        pathMatch:'full'
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/base.module').then(m => m.BaseModule)
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'reports',
        component: AnalysisReportComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/buttons.module').then(m => m.ButtonsModule)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/chartjs/chartjs.module').then(m => m.ChartJSModule)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/icons.module').then(m => m.IconsModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/theme.module').then(m => m.ThemeModule)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/widgets.module').then(m => m.WidgetsModule)
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
