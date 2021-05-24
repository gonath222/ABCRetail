import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserTokenModel } from 'src/app/models/UserTokenModel';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  isUserLoggedIn = false;
  userData!: UserTokenModel;
  isToggle = false;
  UserCategory = "";
  constructor(private authService: AuthService, private message: MessageService, private elementRef: ElementRef, private route: Router) { }

  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }
 
    if (targetElement.classList != undefined && targetElement.classList.length > 0) {
      if (targetElement.classList.contains("fa-angle-down") || targetElement.classList.contains("fa-angle-up")) {
        this.isToggle = !this.isToggle;
      }
      else {
        this.isToggle = false;
      }
    }
    else {
      this.isToggle = false;
    }

  }


  ngOnInit(): void {
    this.authService.userTokenModel.subscribe(user => {
      if(user != undefined){
      this.userData = user;
      this.isUserLoggedIn = !!user;
      this.UserCategory = this.userData.isAdmin ? "Administrator" : "Account Holder";
    }
    else
    {
      this.isUserLoggedIn = false;
    }
  })
  }

  ngAfterViewInit(){
    if (this.authService.GetLocalStorage(false) == null) {
      this.isUserLoggedIn = false;
    }
    else {
      this.userData = this.authService.UserSessionData;
      this.UserCategory = this.userData.isAdmin ? "Administrator" : "Account Holder";
      this.isUserLoggedIn = true;
    }
  }

  LogOutUser() {
    this.authService.LogOutUser();
    this.route.navigate(["/home"]);
  }
}
