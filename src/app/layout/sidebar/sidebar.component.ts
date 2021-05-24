import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  isUserLoggedin = false;
  isAdminLoggedin = false;
  isUserActive = true;
  constructor(private authService: AuthService) {
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


    this.authService.userDetailsSubject.subscribe(data => {
      if (data.IsActive) {
        this.isUserActive = true;
      }
      else {
        this.isUserActive = false;
      }
    });

    if (this.authService.UserDetails != undefined) {
      this.isUserActive = this.authService.UserDetails.IsActive;
    }
  }

  ngOnInit(): void {
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
