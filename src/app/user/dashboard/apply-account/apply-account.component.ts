import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountTypeValue, UserAccountModel } from 'src/app/models/UserAccountModel';
import { AccountTypes, UserDetails } from 'src/app/models/UserDetails';
import { AccountsService } from 'src/app/services/accounts.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-apply-account',
  templateUrl: './apply-account.component.html'
})
export class ApplyAccountComponent implements OnInit {
  @Input() type: string = "";
  loanamount: string = "";
  atype: string = "-1";
  account: AccountTypeValue[] = [];
  accountModel!: UserAccountModel[];
  isSuccess = false;
  pageTitle = "";
  userDetails!: UserDetails;
  isFailure = false;
  constructor(public activeModal: NgbActiveModal, private auth: AuthService, private accountService: AccountsService, private message: MessageService) { }

  ngOnInit(): void {
    this.atype = "-1";
  }

  OnSubmit() {
    this.isFailure = false;
    if (this.loanamount == "" || this.loanamount == "0") {
      this.isFailure = true;
      this.isSuccess = false;
    }
    else {
      this.message.IsLoadinginProgressSubjective.next(true);
      this.accountService.GetAccountDetails(this.auth.UserDetails).subscribe(data => {
        this.accountModel = data;
        this.ConstructAccountDetails(this.auth.UserDetails.UserId, this.type);
        this.accountService.UpdateAccountDetails(this.accountModel[0]).subscribe(data => {
          this.ConstructUserDetails(this.auth.UserDetails, this.type);
          this.accountService.UpdateUser(this.userDetails, this.auth.UserSessionData.jsonId).subscribe(() => {
            this.accountService.AddRequestLog(this.userDetails, this.type, this.loanamount).subscribe(() => { });
            this.message.IsLoadinginProgressSubjective.next(false);
            this.isSuccess = true;
            setTimeout(() => {
              this.activeModal.dismiss('Cross click');
            }, 2000);
          });
        }
        );
      });
    }
  }

  ConstructAccountDetails(userId: string, type: string) {
    this.account = [];
    this.accountModel[0].Accounts.filter(eachAccount => {
      switch (eachAccount.AccountType) {
        case 'dsa':
          this.account.push({
            AccountNumber: eachAccount.AccountNumber,
            AccountType: eachAccount.AccountType,
            AccountValue: type == "dsa" ? this.loanamount : eachAccount.AccountValue,
            IsActiveAccount: type == "dsa" ? false : eachAccount.IsActiveAccount
          })
          break;
        case 'pl':
          this.account.push({
            AccountNumber: eachAccount.AccountNumber,
            AccountType: eachAccount.AccountType,
            AccountValue: type == "pl" && this.atype == "pl" ? this.loanamount : eachAccount.AccountValue,
            IsActiveAccount: type == "pl" && this.atype == "pl" ? false : eachAccount.IsActiveAccount
          })
          break;
        case 'cc':
          this.account.push({
            AccountNumber: eachAccount.AccountNumber,
            AccountType: eachAccount.AccountType,
            AccountValue: type == "cc" ? this.loanamount : eachAccount.AccountValue,
            IsActiveAccount: type == "cc" ? false : eachAccount.IsActiveAccount
          })
          break;
        case 'carl':
          this.account.push({
            AccountNumber: eachAccount.AccountNumber,
            AccountType: eachAccount.AccountType,
            AccountValue: type == "pl" && this.atype == "carl" ? this.loanamount : eachAccount.AccountValue,
            IsActiveAccount: type == "pl" && this.atype == "carl" ? false : eachAccount.IsActiveAccount
          })
          break;
      }
    });
    this.accountModel[0] = {
      ID: this.accountModel[0].ID,
      UserId: userId,
      Accounts: this.account
    };
  }

  ConstructUserDetails(user: UserDetails, typeInput: string) {
    const accountType: AccountTypes[] = [];
    user.AType.filter(type => {
      switch (type.Types) {
        case 'dsa':
          accountType.push({
            Types: type.Types,
            IsActive: typeInput == "dsa" ? true : type.IsActive
          })
          break;
        case 'pl':
          accountType.push({
            Types: type.Types,
            IsActive: typeInput == "pl" && this.atype == "pl" ? true : type.IsActive
          })
          break;
        case 'cc':
          accountType.push({
            Types: type.Types,
            IsActive: typeInput == "cc" ? true : type.IsActive
          })
          break;
        case 'carl':
          accountType.push({
            Types: type.Types,
            IsActive: typeInput == "pl" && this.atype == "carl" ? true : type.IsActive
          })
          break;
      }
    });
    this.userDetails = { ...user, AType: accountType };
  }
}
