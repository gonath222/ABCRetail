import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { forkJoin, Observable, pipe } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { UserDetails } from "../models/UserDetails";
import { UserAccountModel } from "../models/UserAccountModel";
import { UserTransactionModel } from "../models/UserTransactionModel";
import { UserRequestModel } from "../models/UserRequestModel";
import { MessageService } from "./message.service";
import * as XLSX from 'xlsx';

@Injectable({ providedIn: 'root' })

export class AccountsService {

    private JsonExt = ".json";
    constructor(private http: HttpClient, private message: MessageService) { }

    GetAllUserDetails() {
        return this.http.get<UserDetails[]>(environment.FireBaseDataBase + environment.UserDataBase + this.JsonExt).pipe(map(resp => {
            const userList = [];
            for (const key in resp) {
                if (resp.hasOwnProperty(key) && !resp[key].IsAdmin) {
                    userList.push({ ...resp[key], ID: key });
                }
            }

            return userList;
        }), catchError((error) => {
            //this.message.IsLoadinginProgressSubjective.next(false);
            throw error;
        }));
    }

    GetUserDetails(userId?: string) {
        return this.http.get<UserDetails>(environment.FireBaseDataBase + "userdetails/" + userId + this.JsonExt);
    }

    AddAccountDetails(account: UserAccountModel) {
        return this.http.post(environment.FireBaseDataBase + environment.AccountDataBase + this.JsonExt, account);
    }

    UpdateAccountDetails(account: UserAccountModel) {
        return this.http.put(environment.FireBaseDataBase + "accounts/" + account.ID + this.JsonExt, account);
    }

    UpdateUser(userDetails: UserDetails, userid?: string) {
        return this.http.put(environment.FireBaseDataBase + "userdetails/" + userid + this.JsonExt, userDetails);
    }

    UpdateRequestLog(requestlog: UserRequestModel[]) {
        const request = [];
        for (let i = 0; i < requestlog.length; i++) {
            request.push(this.http.put(environment.FireBaseDataBase + "userrequest/" + requestlog[i].ID + this.JsonExt, requestlog[i]))
        }
        if (requestlog.length > 0) {
            forkJoin(request).subscribe();
        }
    }

    GetAccountDetails(userDetails: UserDetails) {
        //this.message.IsLoadinginProgressSubjective.next(true);
        return this.http.get<UserAccountModel[]>(environment.FireBaseDataBase + environment.AccountDataBase + this.JsonExt).pipe(map(resp => {
            const accountList = [];
            for (const key in resp) {
                if (resp.hasOwnProperty(key) && resp[key].UserId == userDetails.UserId) {
                    accountList.push({ ...resp[key], ID: key });
                }
                this.message.IsLoadinginProgressSubjective.next(false);
            }
            return accountList;
        }), catchError((error) => {
            //this.message.IsLoadinginProgressSubjective.next(false);
            throw error;
        }));
    }

    GetAllAccountDetails() {
        return this.http.get<UserAccountModel[]>(environment.FireBaseDataBase + environment.AccountDataBase + this.JsonExt).pipe(map(resp => {
            const accountList = [];
            for (const key in resp) {
                if (resp.hasOwnProperty(key)) {
                    accountList.push({ ...resp[key], ID: key });
                }
            }
            return accountList;
        }), catchError((error) => {
            //this.message.IsLoadinginProgressSubjective.next(false);
            throw error;
        }));
    }

    GenerateAccountNumber(length: number, format: string): string {
        var randomChars = '0123456789';
        var result = '';
        if (format == "cc") {
            result = '5213-xxxx-4xxx-xxxx'.replace(/[x]/g, (c): string => {
                var r = Math.random() * 24, v = c == 'x' ? r : 0;
                return v.toString().charAt(0);
            });
            return result;
        }
        else {
            for (var i = 0; i < length; i++) {
                result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
            }
            return result;
        }
    }

    TransferMoneyFromSavingsAccount(fromUser: UserAccountModel, toUser: UserAccountModel, Amount: string, fromUserId?: string, toUserId?: string): Observable<any> {
        //this.message.IsLoadinginProgressSubjective.next(true);
        return this.GetTwoUserDetails(fromUserId, toUserId).pipe(map(data => {
            if (data != null) {
                const transactions: UserTransactionModel = {
                    FromAccountID: fromUser.UserId,
                    FromUserName: data[0].FName + " " + data[0].LName,
                    FromAccountNumber: fromUser.Accounts.find(a => a.AccountType == "dsa")?.AccountNumber,
                    ToAccountID: toUser.UserId,
                    ToUserName: data[1].FName + " " + data[1].LName,
                    ToAccountNumber: toUser.Accounts.find(a => a.AccountType == "dsa")?.AccountNumber,
                    IsSuccess: true,
                    TransferedAmount: +Amount,
                    TransferedOn: new Date(),
                    TransactionId: this.GenerateAccountNumber(10, "dsa")
                }

                const fromUserAccountPut = this.http.put(environment.FireBaseDataBase + "accounts/" + fromUser.ID + this.JsonExt, fromUser);
                const toUserAccountPut = this.http.put(environment.FireBaseDataBase + "accounts/" + toUser.ID + this.JsonExt, toUser);
                const addtranPost = this.http.post(environment.FireBaseDataBase + environment.TransactionDataBase + this.JsonExt, transactions);
                return forkJoin([fromUserAccountPut, toUserAccountPut, addtranPost]).subscribe(result => {
                    this.message.SuccessMessageSubjective.next(Amount + " Amount Successfully transfered to " + data[1].FName + " " + data[1].LName);
                    //this.message.IsLoadinginProgressSubjective.next(false);
                    return result;
                }), catchError(error => {
                    throw error;
                });
            }
            else {
                this.message.ErrorMessageSubjective.next("An unknown error occured");
                //this.message.IsLoadinginProgressSubjective.next(false);
                return false;
            }
        }));
    }

    PayBillFromSavingsAccount(fromUser: UserAccountModel, user: UserDetails, type: string, amount: string): Observable<any> {
        const transactions: UserTransactionModel = {
            FromAccountID: fromUser.UserId,
            FromUserName: user.FName + " " + user.LName,
            FromAccountNumber: fromUser.Accounts.find(a => a.AccountType == "dsa")?.AccountNumber,
            ToAccountID: fromUser.Accounts.find(a => a.AccountType == type)?.AccountNumber,
            ToUserName: type == "cc" ? "Credit Card Payment" : "Personal/Car Loan Payment",
            ToAccountNumber: fromUser.Accounts.find(a => a.AccountType == type)?.AccountNumber,
            IsSuccess: true,
            TransferedAmount: +amount,
            TransferedOn: new Date(),
            TransactionId: this.GenerateAccountNumber(10, "dsa")
        }

        const fromUserAccountPut = this.http.put(environment.FireBaseDataBase + "accounts/" + fromUser.ID + this.JsonExt, fromUser);
        const addtranPost = this.http.post(environment.FireBaseDataBase + environment.TransactionDataBase + this.JsonExt, transactions);
        return forkJoin([fromUserAccountPut, addtranPost]);
    }
    GetTwoUserDetails(fromUserId?: string, toUserId?: string): Observable<any> {
        const fromUserDetailsUrl = this.http.get(environment.FireBaseDataBase + "userdetails/" + fromUserId + this.JsonExt);
        const toUserDetailsUrl = this.http.get(environment.FireBaseDataBase + "userdetails/" + toUserId + this.JsonExt);
        return forkJoin([fromUserDetailsUrl, toUserDetailsUrl]).pipe(map(result => {
            return result;
        }), catchError((error) => {
            //this.message.IsLoadinginProgressSubjective.next(false);
            throw error;
        }));
    }

    GetTransactionDetails(userid?: string) {
        return this.http.get<UserTransactionModel[]>(environment.FireBaseDataBase + environment.TransactionDataBase + this.JsonExt).pipe(map(resp => {
            const sentTransationList = [];
            const receTransationList = [];
            for (const key in resp) {
                if (resp.hasOwnProperty(key) && resp[key].FromAccountID == userid) {
                    sentTransationList.push({ ...resp[key], ID: key });
                }
            }

            for (const key in resp) {
                if (resp.hasOwnProperty(key) && resp[key].ToAccountID == userid) {
                    receTransationList.push({ ...resp[key], ID: key });
                }
            }
            return { sentTransationList, receTransationList };
        }), catchError((error) => {
            //this.message.IsLoadinginProgressSubjective.next(false);
            throw error;
        }));
    }

    AddRequestLog(userDetails: UserDetails, type: string, amount: string) {
        const requestDetails: UserRequestModel = {
            Amount: +amount,
            AppliedFor: type,
            UserId: userDetails.UserId,
            UserName: userDetails.FName + " " + userDetails.LName,
            IsActive: true,
            RequestedOn: new Date,
            JsonId: userDetails.ID
        }
        return this.http.post(environment.FireBaseDataBase + environment.UserRequest + this.JsonExt, requestDetails);
    }

    GetRequestLog(userDetails: UserDetails) {
        //this.message.IsLoadinginProgressSubjective.next(true);
        return this.http.get<UserRequestModel[]>(environment.FireBaseDataBase + environment.UserRequest + this.JsonExt).pipe(map(resp => {
            const accountList = [];
            for (const key in resp) {
                if (resp.hasOwnProperty(key) && resp[key].UserId == userDetails.UserId) {
                    accountList.push({ ...resp[key], ID: key });
                }
                //this.message.IsLoadinginProgressSubjective.next(false);
            }
            return accountList;
        }), catchError((error) => {
            //this.message.IsLoadinginProgressSubjective.next(false);
            throw error;
        }));
    }

    GetAllActiveRequestLog() {
        //this.message.IsLoadinginProgressSubjective.next(true);
        return this.http.get<UserRequestModel[]>(environment.FireBaseDataBase + environment.UserRequest + this.JsonExt).pipe(map(resp => {
            const accountList = [];
            for (const key in resp) {
                if (resp.hasOwnProperty(key) && resp[key].IsActive) {
                    accountList.push({ ...resp[key], ID: key });
                }
                //this.message.IsLoadinginProgressSubjective.next(false);
            }
            return accountList;
        }), catchError((error) => {
            //this.message.IsLoadinginProgressSubjective.next(false);
            throw error;
        }));
    }

    ExportToExcel(id: string) {
        let element = document.getElementById(id);
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, id.toUpperCase() + ".xlsx");
    }
}