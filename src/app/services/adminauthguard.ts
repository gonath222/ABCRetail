import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { MessageService } from './message.service';


@Injectable()
export class AdminAuthGuard implements CanActivateChild {

    constructor(private router: Router, private authservice: AuthService, private message:MessageService) {
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
       return this.CheckUserAuthorized();
    }

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | UrlTree {
       return this.CheckUserAuthorized();
    }

    private CheckUserAuthorized(){
        if (this.authservice.UserSessionData.isAdmin) {
            this.message.IsLoadingUrlCorrect.next(true);
            return true;
         }
         else
         {
             this.message.ErrorMessageSubjective.next("You are not authorized to see this page. You will be redirecting to authorized page in 5 seconds");
             this.message.IsLoadingUrlCorrect.next(false);
             return false;
         }
    }
}