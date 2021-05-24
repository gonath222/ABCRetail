import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { LoginComponent } from './login.component';
import { LoginRouteModule } from './login.routing.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    LoginRouteModule    
  ],
  providers: [],
})
export class LoginModule { }
