import { Component, OnInit } from '@angular/core';
import { UserRequestModel } from 'src/app/models/UserRequestModel';
import { AccountsService } from 'src/app/services/accounts.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-myrequest',
  templateUrl: './myrequest.component.html'
})
export class MyrequestComponent implements OnInit {

  allUserRequest: UserRequestModel[]=[];
  constructor(private accountService:AccountsService, private auth: AuthService, private message: MessageService) { }

  ngOnInit(): void {
    this.message.SetTitle("User | My Requests | ABC Retail Bank");
    this.accountService.GetRequestLog(this.auth.UserDetails).subscribe(resp => {
      this.allUserRequest = resp;
    });
  }

  exporttoexcel(id: string) {
    this.accountService.ExportToExcel(id);
  }
}
