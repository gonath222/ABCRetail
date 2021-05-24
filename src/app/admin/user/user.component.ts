import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { UserDetails } from 'src/app/models/UserDetails';
import { AccountsService } from 'src/app/services/accounts.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-adminviewuser',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class AdminViewUserComponent implements OnInit {

  userId: string | null = "";
  userDetails!: UserDetails;
  isUserValid = false;
  @Output() userDataEventOutput = new EventEmitter<UserDetails>();
  constructor(private activateRouter: ActivatedRoute, private accountService: AccountsService, private message: MessageService) { }

  ngOnInit(): void {
    this.message.SetTitle("Admin | User Page | ABC Retail Bank");
    this.activateRouter.params.subscribe(params => {
      this.userId = params['id'];
    });

    if (this.userId != null) {
      this.accountService.GetUserDetails(this.userId).subscribe(userdata => {
        if (userdata != null) {
          this.userDetails = userdata;
          this.isUserValid = true;
        }
        else {
          this.message.ErrorMessageSubjective.next("No user associated with this ID");
          this.isUserValid = false;
        }
      });
    }
  }

}
