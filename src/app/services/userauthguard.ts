import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { MessageService } from './message.service';


@Injectable()
export class UserAuthGuard implements CanActivateChild {

    constructor(private router: Router, private messageService: MessageService, private authservice: AuthService) {
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        return this.CheckUserAuthorized();
    }

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | UrlTree {
        return this.CheckUserAuthorized();
    }

    private CheckUserAuthorized() {
        if (!this.authservice.UserSessionData.isAdmin) {
            this.messageService.IsLoadingUrlCorrect.next(true);
            return true;
        }
        else {
            this.messageService.ErrorMessageSubjective.next("You are not authorized to see this page. You will be redirecting to authorized page in 5 seconds");
            this.messageService.IsLoadingUrlCorrect.next(false);
            return false;
        }
    }
}