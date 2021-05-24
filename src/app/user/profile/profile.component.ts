import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserDetails, AccountTypes } from 'src/app/models/UserDetails';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';

import state from '../../appjsons/states.json';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  registerForm!: FormGroup;
  submitted: boolean = false;
  public stateList: { code: string, name: string }[] = state;
  UserDetails!: UserDetails;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private authService: AuthService, private messageService: MessageService) { 

  }

  ngOnInit(): void {
    this.messageService.SetTitle("User | My Profile | ABC Retail Bank");
    this.registerForm = this.fb.group({
      fName: ['', Validators.required],
      lName: ['', Validators.required],
      pancard: ['', Validators.required],
      aadhar: ['', Validators.required],
      city: ['', Validators.required],
      gender:['',Validators.required],
      state: ['', Validators.required],
      pincode: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      accepttc: [false, Validators.requiredTrue],
      company: ['', Validators.required],
      designation: ['', Validators.required],
    },
    );

    this.UserDetails = this.authService.UserDetails;
    this.registerForm.controls['fName'].setValue(this.UserDetails.FName);
    this.registerForm.controls['lName'].setValue(this.UserDetails.LName);
    this.registerForm.controls['pancard'].setValue(this.UserDetails.PanCard);
    this.registerForm.controls['aadhar'].setValue(this.UserDetails.AadharNumber);
    this.registerForm.controls['city'].setValue(this.UserDetails.City);
    this.registerForm.controls['gender'].setValue(this.UserDetails.Gender);
    this.registerForm.controls['state'].setValue(this.UserDetails.State);
    this.registerForm.controls['pincode'].setValue(this.UserDetails.Pincode);
    this.registerForm.controls['address'].setValue(this.UserDetails.Address);
    this.registerForm.controls['phone'].setValue(this.UserDetails.PhoneNumber);
    this.registerForm.controls['company'].setValue(this.UserDetails.CompanyName);
    this.registerForm.controls['designation'].setValue(this.UserDetails.Designation);
  }

  get registerFormControl() {
    return this.registerForm.controls;
  }

  onUpdate() {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.messageService.IsLoadinginProgressSubjective.next(true);
      this.GetUserDetailsData(this.authService.UserDetails);
      this.authService.UpdateUserDetails(this.UserDetails).subscribe(data =>{
        this.authService.GetUserDetails();
        this.messageService.SuccessMessageSubjective.next("Your Profile Updated successfully");
        this.submitted = false;
        this.messageService.IsLoadinginProgressSubjective.next(false);
      },
      errorMessage => {
        this.messageService.IsLoadinginProgressSubjective.next(false);
        this.messageService.ErrorMessageSubjective.next("Unknown error occured");
        console.log(errorMessage);
        this.submitted = false;
      })
    }
    else {
      //this.submitted = false;
    }
}

  GetUserDetailsData(user: UserDetails) {
    this.UserDetails = {
      AadharNumber: this.registerForm.controls['aadhar'].value,
      Address : this.registerForm.controls['address'].value,
      City : this.registerForm.controls['city'].value,
      Email : user.Email,
      FName : this.registerForm.controls['fName'].value,
      LName : this.registerForm.controls['lName'].value,
      PanCard : this.registerForm.controls['pancard'].value,
      PhoneNumber : this.registerForm.controls['phone'].value,
      Pincode : this.registerForm.controls['pincode'].value,
      State : this.registerForm.controls['state'].value,
      Gender: this.registerForm.controls['gender'].value,
      RegisteredDate : new Date(),
      UserId : user.UserId,
      IsAdmin : false,
      AType: user.AType,
      IsActive : user.IsActive,
      CompanyName: user.CompanyName,
      Designation: user.Designation,
      OpenBalance: user.OpenBalance
    };
  }

  IsFormValid() {
    if (this.submitted) {
      return (this.registerFormControl.fName.errors?.required ||
        this.registerFormControl.lName.errors?.required ||
        this.registerFormControl.pancard.errors?.required ||
        this.registerFormControl.aadhar.errors?.required ||
        this.registerFormControl.city.errors?.required ||
        this.registerFormControl.state.errors?.required ||
        this.registerFormControl.pincode.errors?.required ||
        this.registerFormControl.phone.errors?.required ||
        this.registerFormControl.company.errors?.required ||
        this.registerFormControl.designation.errors?.required ||
        this.registerFormControl.accepttc.errors?.required);
    }
    else {
      return false;
    }
  }

}
