import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { MessageService } from './message.service';


@Injectable()
export class HomeAuthGuard {

    constructor(private router: Router, private messageService: MessageService, private authservice: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | UrlTree {
       return this.CheckUserAuthorized();
    }

    private CheckUserAuthorized(){
        if (this.authservice.isTokenExpired ||  this.authservice.UserSessionData == null || this.authservice.UserSessionData == undefined || this.authservice.UserSessionData.email == "") {
            return true;
         }
         else
         {
             this.messageService.ErrorMessageSubjective.next("Your are logged in the application, you will be redirecting the authroized page in 5 seconds");
             this.messageService.IsLoadingUrlCorrect.next(false);
             return false;
         }
    }
}