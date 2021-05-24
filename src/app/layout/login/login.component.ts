import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  email: string = "";
  password: string = "";
  isLoading: boolean = false;
  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) { }

  ngOnInit(): void {
    this.messageService.SetTitle("Login | ABC Retail Bank");
  }

  OnLoginSubmit() {
    this.isLoading = true;
    this.messageService.IsLoadinginProgressSubjective.next(true);
    this.authService.AccountLogin(this.email, this.password).subscribe(resData => {
      if (resData) {
        this.authService.GetandAddUserDetailsinStorage(resData.localId, resData).subscribe(data =>{
          this.messageService.IsLoadinginProgressSubjective.next(false);
          if(data)
          {
            if (this.authService.IsAdminUser) {
              this.isLoading = false;
              this.router.navigate(["admin/dashboard"]);
            }
            else {
              this.isLoading = false;
              this.router.navigate(["user/dashboard"]);
            }
          }
          else
          {
            this.messageService.ErrorMessageSubjective.next("Your Account is still not active.");
          }
        });
      }
    },
      errorMessage => {
        this.messageService.IsLoadinginProgressSubjective.next(false);
        this.messageService.ErrorMessageSubjective.next(errorMessage);
        this.isLoading = false;
        console.log(errorMessage);
      });
  }
}
