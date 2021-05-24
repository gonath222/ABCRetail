import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActiveuserComponent } from './admin/user/activeuser/activeuser.component';
import { AdminDashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminViewUserComponent } from './admin/user/user.component';
import { AdminUserlistComponent } from './admin/user/userlist/userlist.component';
import { ErropageComponent } from './layout/erropage/erropage.component';
import { FaqComponent } from './layout/faq/faq.component';
import { HomepageComponent } from './layout/homepage/homepage.component';
import { LoginComponent } from './layout/login/login.component';
import { OpenaccountComponent } from './layout/openaccount/openaccount.component';
import { AdminAuthGuard } from './services/adminauthguard';
import { UserAuthGuard } from './services/userauthguard';
import { UserDashboardComponent } from './user/dashboard/dashboard.component';
import { ProfileComponent } from './user/profile/profile.component';
import { UserTransactionsComponent } from './user/transactions/transactions.component';
import { SearchuserComponent } from './admin/searchuser/searchuser.component';
import { TransferfundsComponent } from './user/transferfunds/transferfunds.component';
import { MyrequestComponent } from './user/myrequest/myrequest.component';
import { SearchtransactionsComponent } from './user/searchtransactions/searchtransactions.component';
import { HomeAuthGuard } from './services/home.authguard';

const routes: Routes = [
  { path: '', component: HomepageComponent, canActivate: [HomeAuthGuard] },
  { path: 'login', canActivate: [HomeAuthGuard], loadChildren: () => import('./layout/login/login.module').then(m => m.LoginModule) }, { path: 'login', component: LoginComponent },
  { path: 'openaccount', component: OpenaccountComponent, canActivate: [HomeAuthGuard] },
  { path: 'home', component: HomepageComponent, canActivate: [HomeAuthGuard] },
  { path: 'faq', component: FaqComponent },
  {
    path: 'user', canActivate: [UserAuthGuard], canActivateChild: [UserAuthGuard],
    children: [
      {
        path: 'dashboard', component: UserDashboardComponent
      },
      {
        path: 'transactions', component: UserTransactionsComponent
      },
      {
        path: 'profile', component: ProfileComponent
      },
      {
        path: 'fundtransfer', component: TransferfundsComponent
      },
      {
        path: 'myrequest', component: MyrequestComponent
      },
      {
        path: 'searchtransactions', component: SearchtransactionsComponent
      },
      { path: '', component: UserDashboardComponent }
    ]
  },
  {
    path: 'admin', canActivate: [AdminAuthGuard], canActivateChild: [AdminAuthGuard],
    children: [
      {
        path: 'dashboard', component: AdminDashboardComponent
      },
      { path: '', component: AdminDashboardComponent },
      {
        path: 'user', canActivate: [AdminAuthGuard], canActivateChild: [AdminAuthGuard],
        children: [
          {
            path: 'recentlist', component: AdminUserlistComponent
          },
          {
            path: 'activelist', component: ActiveuserComponent
          },
          {
            path: 'search', component: SearchuserComponent
          },
        ]
      },
      {
        path: 'user/:id', component: AdminViewUserComponent
      }
    ]
  },
  { path: '**', component: ErropageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
