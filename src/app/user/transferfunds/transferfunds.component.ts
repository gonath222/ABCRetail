import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { AccountTypeValue, UserAccountModel } from 'src/app/models/UserAccountModel';
import { AccountsService } from 'src/app/services/accounts.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { UserDetails } from "../../models/UserDetails";

@Component({
  selector: 'app-transferfunds',
  templateUrl: './transferfunds.component.html'
})
export class TransferfundsComponent implements OnInit {

  userDetails: UserDetails[] = [];
  selectedUser!: UserDetails | null;
  selectedUserAccount: UserAccountModel[] = [];
  loggedinUserAccount: UserAccountModel[] = [];
  NoSavingAccount = "";
  BalanceAmount = "";
  tamount = "";
  billPay = "";
  accountDetails!: AccountTypeValue;
  isAccountLoaded = false;
  selectedLoanAccount = "";

  constructor(private location: Location, private route: ActivatedRoute, private accounts: AccountsService, private auth: AuthService, private message: MessageService) { }

  ngOnInit(): void {
    this.message.SetTitle("User | Transfer funds | ABC Retail Bank");
    this.route.queryParams.subscribe(
      params => {
        this.billPay = params['pay'];
        this.isAccountLoaded = false;
        this.GetAccountInfo(this.billPay == "cc" ? this.billPay : "");
        this.selectedLoanAccount = this.billPay == "cc" ? this.billPay : "";
        this.GetBalanceAmount();
      }
    );
    if (this.billPay == undefined) {
      this.GetBalanceAmount();
    }
    else if (this.billPay == "cc" || this.billPay == "pl") {
      this.GetAccountInfo(this.billPay);
    }
    else {
    }
  }

  GetAccountInfo(type: string) {
    if (type != "") {
      this.accounts.GetAccountDetails(this.auth.UserDetails).subscribe(data => {
        if (data.length > 0) {
          data[0].Accounts.filter(a => {
            if (a.AccountType == type && a.IsActiveAccount && +a.AccountValue > 0) {
              this.accountDetails = a;
              this.isAccountLoaded = true;
            }
          });
        }
      });
    }
  }

  GetBalanceAmount() {
    this.accounts.GetAllUserDetails().subscribe(data => {
      if (data.length > 0) {
        this.userDetails = [];
        data.filter(user => {
          this.accounts.GetAccountDetails(this.auth.UserDetails).subscribe(data => {
            const acc = data.map(account => {
              return account.Accounts;
            });
            this.loggedinUserAccount = data;
            const dsa = acc.map(acco => {
              return acco.find(a => {
                return (a.AccountType == "dsa" && a.IsActiveAccount) ?? a.AccountValue;
              })
            });
            this.BalanceAmount = dsa[0] != null ? dsa[0].AccountValue?.toString() : "0";
            if (this.BalanceAmount == "0") {
              this.message.ErrorMessageSubjective.next("You dont have sufficient balance to transfer the money");
            }
          }
          );
          user.AType.filter(type => {
            if (type.Types == "dsa" && type.IsActive) {
              if (user.IsActive && !user.IsAdmin && user.UserId != this.auth.UserDetails.UserId) {
                this.userDetails.push(user);
              }
            }
          })
        });
      }
    });
  }

  CancelTransaction() {
    this.location.back();
  }

  AccountSelectionChanged(userID: string) {
    if (userID != "") {
      this.userDetails.filter(user => {
        if (user.UserId == userID) {
          this.selectedUser = user;
          this.accounts.GetAccountDetails(user).subscribe(data => {
            const acc = data.map(account => {
              return account.Accounts;
            });
            this.selectedUserAccount = data;
            const dsa = acc.map(acco => {
              return acco.find(a => {
                return (a.AccountType == "dsa" && a.IsActiveAccount) ?? a.AccountValue;
              })
            });
            this.NoSavingAccount = dsa[0] != null ? dsa[0].AccountNumber?.toString() : "0";
          })
        }
      });
    }
    else {
      this.selectedUser = null;
    }
  }

  LoanSelectionChanged(type: string) {
    this.isAccountLoaded = false;
    this.selectedLoanAccount = type;
    this.GetAccountInfo(type);
  }

  OnSubmit() {
    if (this.billPay == undefined) {
      this.SavingsAccountTransfer();
    }
    else if (this.billPay == "cc" || this.billPay == "pl") {
      this.PayCCorPLAccountTransfer();
    }
  }

  PayCCorPLAccountTransfer() {
    if (+this.BalanceAmount < +this.tamount) {
      this.message.ErrorMessageSubjective.next("Amount is greater than your balance. Your balance is " + this.BalanceAmount);
      return;
    }
    if (this.tamount == "" || (this.billPay != 'cc' && this.selectedLoanAccount == "")) {
      this.message.ErrorMessageSubjective.next("Fill all the fields to transfer money ");
      return;
    }
    if (+this.tamount > +this.accountDetails.AccountValue) {
      this.message.ErrorMessageSubjective.next("Entered amount is greater than your Personal Loan/Credit card outstanding");
      return;
    }
    this.UpdateAccountModelForPLandCC();
    this.accounts.PayBillFromSavingsAccount(this.loggedinUserAccount[0], this.auth.UserDetails, this.selectedLoanAccount, this.tamount).subscribe(() => {
      this.GetBalanceAmount();
      this.GetAccountInfo(this.billPay);
      const successMess = this.tamount + " Amount Successfully transfered " + (this.billPay == "cc" ? "to your Credit Card account" : "to your Personal/Car loan account");
      this.message.SuccessMessageSubjective.next(successMess);
      this.message.IsLoadinginProgressSubjective.next(false);
      this.isAccountLoaded = false;
      this.selectedLoanAccount = "";
    }), catchError(error => {
      this.message.IsLoadinginProgressSubjective.next(false);
      this.message.ErrorMessageSubjective.next("An unknow error occured");
      this.isAccountLoaded = false;
      this.selectedLoanAccount = "";
      throw error;
    });
  }

  UpdateAccountModelForPLandCC() {
    this.loggedinUserAccount.filter(data => {
      data.Accounts.filter(acc => {
        acc.AccountValue = acc.AccountType == this.selectedLoanAccount || acc.AccountType == "dsa" ? (+acc.AccountValue - +this.tamount).toString() : acc.AccountValue
      })
    });
  }

  SavingsAccountTransfer() {
    if (+this.BalanceAmount < +this.tamount) {
      this.message.ErrorMessageSubjective.next("Amount is greater than your balance. Your balance is " + this.BalanceAmount);
      return;
    }
    if (this.tamount == "" || this.selectedUser == null) {
      this.message.ErrorMessageSubjective.next("Fill all the fields to transfer money ");
      return;
    }
    this.UpdateTransferringAmountinModel();
    this.accounts.TransferMoneyFromSavingsAccount(this.loggedinUserAccount[0], this.selectedUserAccount[0], this.tamount, this.auth.UserSessionData.jsonId, this.selectedUser.ID).subscribe((data) => {
      this.GetBalanceAmount();
      this.isAccountLoaded = false;
      this.selectedUser = null;
    }), catchError(error => {
      this.message.IsLoadinginProgressSubjective.next(false);
      this.message.ErrorMessageSubjective.next("An unknow error occured");
      this.isAccountLoaded = false;
      this.selectedUser = null;
      throw error;
    });
  }

  UpdateTransferringAmountinModel() {
    this.loggedinUserAccount.filter(data => {
      data.Accounts.filter(acc => {
        acc.AccountValue = acc.AccountType == "dsa" ? (+acc.AccountValue - +this.tamount).toString() : acc.AccountValue
      })
    });

    this.selectedUserAccount.filter(data => {
      data.Accounts.filter(acc => {
        acc.AccountValue = acc.AccountType == "dsa" ? (+acc.AccountValue + +this.tamount).toString() : acc.AccountValue
      })
    })
  }
}
