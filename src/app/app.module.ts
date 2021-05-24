import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ErropageComponent } from './layout/erropage/erropage.component';
import { HomepageComponent } from './layout/homepage/homepage.component';
import { OpenaccountComponent } from './layout/openaccount/openaccount.component';
import { FaqComponent } from './layout/faq/faq.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { ErroruiComponent } from './shared/errorui/errorui.component';
import { OnlyNumber } from './directives/onlynumber.directives';
import { DateValueAccessor } from './directives/date.directives';
import { AuthInterceptorService } from './services/auth.interceptor';
import { SuccessuiComponent } from './shared/successui/successui.component';
import { UserDashboardComponent } from './user/dashboard/dashboard.component';
import { UserTransactionsComponent } from './user/transactions/transactions.component';
import { UserAuthGuard } from './services/userauthguard';
import { AdminDashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminUserlistComponent } from './admin/user/userlist/userlist.component';
import { AdminAuthGuard } from './services/adminauthguard';
import { ProfileComponent } from './user/profile/profile.component';
import { GenderPipe } from './pipes/gender.pipe';
import { StatePipe } from './pipes/state.pipe';
import { AdminViewUserComponent } from './admin/user/user.component';
import { AccountTypePipe } from './pipes/atype.pipe';
import { UseraccountComponent } from './admin/user/useraccount/useraccount.component';
import { ActiveuserComponent } from './admin/user/activeuser/activeuser.component';
import { SearchuserComponent } from './admin/searchuser/searchuser.component';
import { TransferfundsComponent } from './user/transferfunds/transferfunds.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApplyAccountComponent } from './user/dashboard/apply-account/apply-account.component';
import { AmountPipe } from './pipes/amount.pipe';
import { UserrequestComponent } from './admin/user/userrequest/userrequest.component';
import { MyrequestComponent } from './user/myrequest/myrequest.component';
import { SearchtransactionsComponent } from './user/searchtransactions/searchtransactions.component';
import { HomeAuthGuard } from './services/home.authguard';


import { NgImageSliderModule } from "ng-image-slider";
import { SliderComponent } from './layout/slider/slider.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    ErropageComponent,
    HomepageComponent,
    OpenaccountComponent,
    FaqComponent,
    LoaderComponent,
    ErroruiComponent,
    OnlyNumber,
    DateValueAccessor,
    SuccessuiComponent,
    UserDashboardComponent,
    UserTransactionsComponent,
    AdminDashboardComponent,
    AdminUserlistComponent,
    ProfileComponent,
    StatePipe,
    GenderPipe,
    AdminViewUserComponent,
    AccountTypePipe,
    UseraccountComponent,
    ActiveuserComponent,
    SearchuserComponent,
    TransferfundsComponent,
    ApplyAccountComponent,
    AmountPipe,
    UserrequestComponent,
    MyrequestComponent,
    SearchtransactionsComponent,
    SliderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    NgImageSliderModule
  ],
  providers: [
    Title,
    UserAuthGuard,
    AdminAuthGuard,
    HomeAuthGuard,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
