import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "src/environments/environment";
import { catchError } from "rxjs/operators";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (req.url.includes(environment.FireBaseApiURL)) {
            const modifiedReq = req.clone({ url: req.url + environment.APIKey });
            return next.handle(modifiedReq);
        }
        else if (req.url.includes("accedo-video-app")) {
            return next.handle(req);
        }
        else {
            const modifiedReq = req.clone({ url: req.url + environment.AuthString + this.authService.UserSessionData.token });
            return next.handle(modifiedReq)
                .pipe(
                    catchError((error: HttpErrorResponse) => {
                        if (error.status == 401) {
                            console.log('Unathourized error occured in the service call');
                            this.authService.LogOutUser();
                        }
                        throw error;
                    })
                );;
        }
    }
}