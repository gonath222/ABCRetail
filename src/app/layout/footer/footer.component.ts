import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {

  isUserLoggedin = false;
  isAdminLoggedin = false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.userTokenModel.subscribe(data => {
      if (data != undefined && data.userId != null) {
        if (data.isAdmin) {
          this.isAdminLoggedin = true;
          this.isUserLoggedin = false;
        }
        else {
          this.isUserLoggedin = true;
          this.isAdminLoggedin = false;
        }
      }
      else {
        this.isUserLoggedin = false;
        this.isAdminLoggedin = false;
      }
    });
  }

  ngAfterViewInit() {
    if(this.authService.GetLocalStorage(false) == null)
    {
      this.isUserLoggedin = false;
      this.isAdminLoggedin = false;
    }
    else if (this.authService.GetLocalStorage(false)?.isAdmin) {
      this.isAdminLoggedin = true;
      this.isUserLoggedin = false;
    }
    else {
      this.isUserLoggedin = true;
      this.isAdminLoggedin = false;
    }
  }

}
