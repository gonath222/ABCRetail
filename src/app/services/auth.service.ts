import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { UserTokenModel } from "../models/UserTokenModel";
import { environment } from "src/environments/environment";
import { UserDetails } from "../models/UserDetails";
import { MessageService } from "./message.service";


interface FirebaseServiceResponse {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string
};

@Injectable({ providedIn: 'root' })

export class AuthService {

    userTokenModel = new Subject<UserTokenModel>();
    userDetailsSubject = new Subject<UserDetails>();
    private userData!: UserTokenModel;
    private userDetails!: UserDetails;
    private isAdminLoggedIn = false;
    private JsonExt = ".json";
    isTokenExpired = false;
    constructor(private http: HttpClient, private messageService: MessageService) { }

    NewAccountCreation(email: string, password: string) {
        this.messageService.IsLoadinginProgressSubjective.next(true);
        return this.http.post<FirebaseServiceResponse>(environment.FireBaseApiURL + environment.FireBaseSignUp,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }).pipe(catchError(this.HandleErrorMessage), tap(response => {
                this.messageService.IsLoadinginProgressSubjective.next(false);
                this.HandleUserTokenModel(response, false);
                return response;
            }
            ));
    }

    AccountLogin(email: string, password: string) {
        this.messageService.IsLoadinginProgressSubjective.next(true);
        return this.http.post<FirebaseServiceResponse>(environment.FireBaseApiURL + environment.FireBaseSignIn,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }).pipe(catchError(this.HandleErrorMessage), tap(response => {
                this.messageService.IsLoadinginProgressSubjective.next(false);
                this.HandleUserTokenModel(response, true);
            }
            ));
    }

    AddUserDetails(userDetails: UserDetails) {
        return this.http.post<FirebaseServiceResponse>(environment.FireBaseDataBase + environment.UserDataBase + this.JsonExt, userDetails
        ).pipe(catchError(this.HandleErrorMessage));
    }

    UpdateUserDetails(userDetails: UserDetails) {
        return this.http.put(environment.FireBaseDataBase + "userdetails/" + this.userData.jsonId + this.JsonExt, userDetails);

    }

    GetandAddUserDetailsinStorage(userID: string, userTokenModel: FirebaseServiceResponse): Observable<UserDetails> {
        return this.http.get<UserDetails[]>(environment.FireBaseDataBase + environment.UserDataBase + this.JsonExt)
            .pipe(map(response => {
                const userdata = [];
                for (const key in response) {
                    if (response.hasOwnProperty(key))
                        userdata.push({ ...response[key], ID: key });
                }

                userdata.filter((user) => {
                    if (user.UserId === userID) {
                        if (user.IsAdmin) {
                            this.isAdminLoggedIn = true;
                        }
                        else {
                            this.isAdminLoggedIn = false;
                        }
                        this.userDetails = user;
                        const usertoken = new UserTokenModel(userTokenModel.email, userTokenModel.localId, this.userDetails.FName, this.isAdminLoggedIn, this.userDetails.ID, userTokenModel.idToken, new Date(new Date().getTime() + +userTokenModel.expiresIn * 1000));
                        this.userTokenModel.next(usertoken);
                        this.userData = usertoken;
                        this.userDetailsSubject.next(this.userDetails);
                        localStorage.removeItem(environment.UserTokenKey);
                        localStorage.setItem(environment.UserTokenKey, JSON.stringify(usertoken));
                    }
                });

                return this.userDetails;
            }));
    }

    GetUserDetails() {
        return this.http.get<UserDetails>(environment.FireBaseDataBase + "userdetails/" + this.userData.jsonId + this.JsonExt).toPromise().then(resp => {
            this.userDetails = resp;
            this.userDetailsSubject.next(this.userDetails);
        });
    }

    get IsAdminUser() {
        return this.isAdminLoggedIn;
    }


    private HandleErrorMessage(errorResponse: HttpErrorResponse) {
        let errorMessage = "";
        switch (errorResponse.error.error.message) {
            case 'EMAIL_NOT_FOUND':
                errorMessage = "Email is not available in the Database. Please create and account";
                break;
            case 'INVALID_PASSWORD':
                errorMessage = "Password is not match for this email address";
                break;
            case 'EMAIL_EXISTS':
                errorMessage = "Email is already available in the Database";
                break;
            case 'WEAK_PASSWORD : Password should be at least 6 characters':
                errorMessage = "Password Should be at least 6 characters"
                break;
            default:
                errorMessage = "";
        }
        return throwError(errorMessage);
    }

    private HandleUserTokenModel(response: FirebaseServiceResponse, isAccountLogin: boolean) {
        const usertoken = new UserTokenModel(response.email, response.localId, "", false, "", response.idToken, new Date(new Date().getTime() + +response.expiresIn * 1000));
        if (isAccountLogin) {
            this.userTokenModel.next(usertoken);
            localStorage.setItem(environment.UserTokenKey, JSON.stringify(usertoken));
        }
        this.userData = usertoken;
    }

    get UserSessionData() {
        return this.userData;
    }

    get UserDetails() {
        return this.userDetails;
    }

    GetLocalStorage(isWithUserDetails: boolean) {
        let userdata = localStorage.getItem(environment.UserTokenKey);
        if (userdata != null && userdata != "" && userdata != "undefined") {
            this.userData = JSON.parse(userdata);
            let a = new Date(this.userData.tokenExpirationDate);
            let b = a.setHours(a.getHours(), a.getMinutes(), a.getSeconds(), a.getMilliseconds());
            let c = new Date();
            let d = c.setHours(c.getHours(), c.getMinutes(), c.getSeconds(), c.getMilliseconds());
            if (b < d) {
                this.isTokenExpired = true;
                return null;
            }
            else {
                this.userTokenModel.next(this.userData);
                if (isWithUserDetails) {
                    this.GetUserDetails();
                }
                return this.userData;
            }
        }
        else {
            return null;
        }
    }

    LogOutUser() {
        this.RemoveLocalStorage();
        this.userTokenModel.next();
    }

    RemoveLocalStorage() {
        localStorage.removeItem(environment.UserTokenKey);
        this.userData = {
            email: "",
            isAdmin: false,
            token: "",
            userId: "",
            jsonId: "",
            userName: "",
            tokenExpirationDate: new Date()
        };
    }

}
