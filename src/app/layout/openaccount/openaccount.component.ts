
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccountTypeValue, UserAccountModel } from 'src/app/models/UserAccountModel';
import { UserDetails, AccountTypes } from 'src/app/models/UserDetails';
import { AccountsService } from 'src/app/services/accounts.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';

import state from '../../appjsons/states.json';

@Component({
  selector: 'app-openaccount',
  templateUrl: './openaccount.component.html'
})
export class OpenaccountComponent implements OnInit {

  registerForm!: FormGroup;
  submitted: boolean = false;
  accountType = "";
  public stateList: { code: string, name: string }[] = state;
  UserDetails!: UserDetails;
  account: AccountTypeValue[] = [];
  accountModel: UserAccountModel[] =[];
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private accountService: AccountsService, private authService: AuthService, private message: MessageService) { }

  ngOnInit(): void {
    this.message.SetTitle("Open Account | ABC Retail Bank");
    this.registerForm = this.fb.group({
      accountType: ['', Validators.required],
      fName: ['', Validators.required],
      lName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      pancard: ['', Validators.required],
      aadhar: ['', Validators.required],
      city: ['', Validators.required],
      gender: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      company: ['', Validators.required],
      designation: ['', Validators.required],
      openbalance: ['', Validators.required],
      accepttc: [false, Validators.requiredTrue]
    },
    );

    this.route.queryParams.subscribe(
      params => {
        this.accountType = params['open'];
        this.registerForm.controls['accountType'].setValue(this.accountType);
      }
    );
  }

  get registerFormControl() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.message.IsLoadinginProgressSubjective.next(true);
      this.authService.NewAccountCreation(this.registerForm.controls['email'].value, this.registerForm.controls['password'].value).subscribe(respData => {
        if (respData != undefined) {
          this.GetUserDetailsData(respData.localId);
          this.authService.AddUserDetails(this.UserDetails).subscribe(() => {
            this.ConstructAccountDetails(respData.localId);
            this.accountService.AddAccountDetails(this.accountModel[0]).subscribe(() => {
              this.message.SuccessMessageSubjective.next("Thanks for the Account Opening. Our representative will check and update you shortly!");
              this.submitted = false;
              this.registerForm.reset();
              this.authService.RemoveLocalStorage();
              this.message.IsLoadinginProgressSubjective.next(false);
            });
          },
            errorMessage => {
              this.message.IsLoadinginProgressSubjective.next(false);
              this.message.ErrorMessageSubjective.next(errorMessage);
              console.log(errorMessage);
            })
        }
        else {
          this.submitted = false;
        }
      },
        errorMessage => {
          this.message.IsLoadinginProgressSubjective.next(false);
          this.message.ErrorMessageSubjective.next(errorMessage);
          console.log(errorMessage);
        });
    }
    else {
    }
  }

  GetUserDetailsData(userId: string) {
    this.UserDetails = {
      AadharNumber: this.registerForm.controls['aadhar'].value,
      Address: this.registerForm.controls['address'].value,
      City: this.registerForm.controls['city'].value,
      Email: this.registerForm.controls['email'].value,
      FName: this.registerForm.controls['fName'].value,
      LName: this.registerForm.controls['lName'].value,
      PanCard: this.registerForm.controls['pancard'].value,
      PhoneNumber: this.registerForm.controls['phone'].value,
      Pincode: this.registerForm.controls['pincode'].value,
      State: this.registerForm.controls['state'].value,
      Gender: this.registerForm.controls['gender'].value,
      RegisteredDate: new Date(),
      AType: [
        { Types: "dsa", IsActive: this.registerForm.controls['accountType'].value == "dsa" },
        { Types: "cc", IsActive: this.registerForm.controls['accountType'].value == "cc" },
        { Types: "pl", IsActive: this.registerForm.controls['accountType'].value == "pl" },
        { Types: "carl", IsActive: this.registerForm.controls['accountType'].value == "carl" }
      ],
      UserId: userId,
      IsAdmin: false,
      IsActive: false,
      CompanyName: this.registerForm.controls['company'].value,
      Designation: this.registerForm.controls['designation'].value,
      OpenBalance: this.registerForm.controls['openbalance'].value
    };
  }

  ConstructAccountDetails(userId: string) {

    this.account = [{
      AccountNumber: this.accountService.GenerateAccountNumber(16, "dsa"),
      AccountType: "dsa",
      AccountValue: this.registerForm.controls['accountType'].value == "dsa" ? this.registerForm.controls['openbalance'].value : 0,
      IsActiveAccount: this.registerForm.controls['accountType'].value == "dsa"
    },
    {
      AccountNumber: this.accountService.GenerateAccountNumber(16, "pl"),
      AccountType: "pl",
      AccountValue: this.registerForm.controls['accountType'].value == "pl" ? this.registerForm.controls['openbalance'].value : 0,
      IsActiveAccount: this.registerForm.controls['accountType'].value == "pl"
    },
    {
      AccountNumber: this.accountService.GenerateAccountNumber(16, "cc"),
      AccountType: "cc",
      AccountValue: this.registerForm.controls['accountType'].value == "cc" ? this.registerForm.controls['openbalance'].value : 0,
      IsActiveAccount: this.registerForm.controls['accountType'].value == "cc"
    },
    {
      AccountNumber: this.accountService.GenerateAccountNumber(16, "carl"),
      AccountType: "carl",
      AccountValue: this.registerForm.controls['accountType'].value == "carl" ? this.registerForm.controls['openbalance'].value : 0,
      IsActiveAccount: this.registerForm.controls['accountType'].value == "carl"
    }
    ]

    this.accountModel.push({
      UserId: userId,
      Accounts: this.account
    });
  }

  IsFormValid() {
    if (this.submitted) {
      return (this.registerFormControl.fName.errors?.required ||
        this.registerFormControl.accountType.errors?.required ||
        this.registerFormControl.lName.errors?.required ||
        this.registerFormControl.email.errors?.required ||
        this.registerFormControl.email.errors?.email ||
        this.registerFormControl.password.errors?.required ||
        this.registerFormControl.pancard.errors?.required ||
        this.registerFormControl.aadhar.errors?.required ||
        this.registerFormControl.city.errors?.required ||
        this.registerFormControl.state.errors?.required ||
        this.registerFormControl.pincode.errors?.required ||
        this.registerFormControl.phone.errors?.required ||
        this.registerFormControl.company.errors?.required ||
        this.registerFormControl.designation.errors?.required ||
        this.registerFormControl.openbalance.errors?.required ||
        this.registerFormControl.accepttc.errors?.required);
    }
    else {
      return false;
    }
  }
}
