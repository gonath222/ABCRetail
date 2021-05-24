import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccountTypeValue, UserAccountModel } from 'src/app/models/UserAccountModel';
import { AccountTypes, UserDetails } from 'src/app/models/UserDetails';
import { UserRequestModel } from 'src/app/models/UserRequestModel';
import { AccountsService } from 'src/app/services/accounts.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-adminuseraccount',
  templateUrl: './useraccount.component.html'
})
export class UseraccountComponent implements OnInit {

  @Input("UserDetails") userData!: UserDetails;
  accountForm!: FormGroup;
  accountModel!: UserAccountModel[];
  submitted = false;
  userId: string = "";
  isUpdateAccount = false;
  account: AccountTypeValue[] = [];
  userRequestModel: UserRequestModel[] = [];
  isUserValid= false;
  constructor(private accountService: AccountsService, private fb: FormBuilder, private message: MessageService, private activateRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.accountForm = this.fb.group({
      dsaBalance: ['', Validators.required],
      plBalance: ['', Validators.required],
      ccBalance: ['', Validators.required],
      carlBalance: ['', Validators.required],
    },
    );

    this.activateRouter.params.subscribe(params => {
      this.userId = params['id'];
    });

    if (this.userData != null && this.userData != undefined) {
      this.isUserValid = true;
      this.message.IsLoadinginProgressSubjective.next(true);
      this.accountService.GetAccountDetails(this.userData).subscribe(data => {
        this.accountModel = data;
        data.filter(account => {
          if (account.Accounts.length > 0) {
            this.account = account.Accounts;
            account.Accounts.filter(eachAccount => {
              this.isUpdateAccount = true;
              switch (eachAccount.AccountType) {
                case 'dsa':
                  this.accountForm.controls['dsaBalance'].setValue(eachAccount.AccountValue);
                  break;
                case 'pl':
                  this.accountForm.controls['plBalance'].setValue(eachAccount.AccountValue);
                  break;
                case 'cc':
                  this.accountForm.controls['ccBalance'].setValue(eachAccount.AccountValue);
                  break;
                case 'carl':
                  this.accountForm.controls['carlBalance'].setValue(eachAccount.AccountValue);
                  break;
              }
            })
          }
        })
        this.message.IsLoadinginProgressSubjective.next(false);
      });

      this.userRequestModel = [];
      this.accountService.GetRequestLog(this.userData).subscribe(data => {
        if (data != null) {
          data.filter(req => {
            if (req.IsActive) {
              this.userRequestModel = data;
            }
          });
        }
      });
    }
    else {
      this.isUserValid = false;
      this.message.ErrorMessageSubjective.next("No user associated with this ID");
    }
  }

  onSubmit() {
    this.message.IsLoadinginProgressSubjective.next(true);
    this.ConstructAccountDetails(this.userData.UserId, this.isUpdateAccount);
    if (this.isUpdateAccount) {
      this.accountService.UpdateAccountDetails(this.accountModel[0]).subscribe(data => {
        this.AccountSubscription(data);
      }
      );
    }
    else {
      this.accountService.AddAccountDetails(this.accountModel[0]).subscribe(data => {
        this.AccountSubscription(data);
      }
      );
    }
  }

  private AccountSubscription(data: object) {
    if (data != null) {
      this.userData.IsActive = true;
      this.accountService.UpdateUser(this.userData, this.userId).subscribe(udata => {
        if (udata != null) {
          this.ConstructUserRequestDetails();
          this.accountService.UpdateRequestLog(this.userRequestModel);
          this.message.IsLoadinginProgressSubjective.next(false);
          this.message.SuccessMessageSubjective.next("Succesfully updated the values");
        }
        else {
          this.message.IsLoadinginProgressSubjective.next(false);
          this.message.ErrorMessageSubjective.next("Unknown error occured. Please try again.");
        }
      })

    }
    else {
      this.message.IsLoadinginProgressSubjective.next(false);
      this.message.ErrorMessageSubjective.next("Unknown error occured. Please try again.");
    }
  }

  get accountFormControl() {
    return this.accountForm.controls;
  }

  ConstructUserRequestDetails() {
    this.userRequestModel.filter(data => {
      data.IsActive = false,
        data.ApprovedOn = new Date
    });
  }

  ConstructAccountDetails(userId: string, isupdate: boolean) {
    if (isupdate) {
      this.account = [];
      this.accountModel[0].Accounts.filter(eachAccount => {
        switch (eachAccount.AccountType) {
          case 'dsa':
            var dsaBool = this.userData.AType.find(a => { return a.Types == eachAccount.AccountType });
            this.account.push({
              AccountNumber: eachAccount.AccountNumber,
              AccountType: eachAccount.AccountType,
              AccountValue: this.accountForm.controls['dsaBalance'].value,
              IsActiveAccount: dsaBool != undefined ? dsaBool.IsActive : eachAccount.IsActiveAccount
            })
            break;
          case 'pl':
            var plBool = this.userData.AType.find(a => { return a.Types == eachAccount.AccountType });
            this.account.push({
              AccountNumber: eachAccount.AccountNumber,
              AccountType: eachAccount.AccountType,
              AccountValue: this.accountForm.controls['plBalance'].value,
              IsActiveAccount: plBool != undefined ? plBool.IsActive : eachAccount.IsActiveAccount
            })
            break;
          case 'cc':
            var ccBool = this.userData.AType.find(a => { return a.Types == eachAccount.AccountType });
            this.account.push({
              AccountNumber: eachAccount.AccountNumber,
              AccountType: eachAccount.AccountType,
              AccountValue: this.accountForm.controls['ccBalance'].value,
              IsActiveAccount: ccBool != undefined ? ccBool.IsActive : eachAccount.IsActiveAccount
            })
            break;
          case 'carl':
            var carlBool = this.userData.AType.find(a => { return a.Types == eachAccount.AccountType });
            this.account.push({
              AccountNumber: eachAccount.AccountNumber,
              AccountType: eachAccount.AccountType,
              AccountValue: this.accountForm.controls['carlBalance'].value,
              IsActiveAccount: carlBool != undefined ? carlBool.IsActive : eachAccount.IsActiveAccount
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
    else {
      this.account = [{
        AccountNumber: this.accountService.GenerateAccountNumber(16, "dsa"),
        AccountType: "dsa",
        AccountValue: this.accountForm.controls['dsaBalance'].value,
        IsActiveAccount: true
      },
      {
        AccountNumber: this.accountService.GenerateAccountNumber(16, "pl"),
        AccountType: "pl",
        AccountValue: this.accountForm.controls['plBalance'].value,
        IsActiveAccount: true
      },
      {
        AccountNumber: this.accountService.GenerateAccountNumber(16, "cc"),
        AccountType: "cc",
        AccountValue: this.accountForm.controls['ccBalance'].value,
        IsActiveAccount: true
      },
      {
        AccountNumber: this.accountService.GenerateAccountNumber(16, "carl"),
        AccountType: "carl",
        AccountValue: this.accountForm.controls['carlBalance'].value,
        IsActiveAccount: true
      }
      ]

      this.accountModel[0] = {
        UserId: userId,
        Accounts: this.account
      };
    }


  }
}
