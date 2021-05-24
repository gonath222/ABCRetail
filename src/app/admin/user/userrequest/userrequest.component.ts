import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRequestModel } from 'src/app/models/UserRequestModel';
import { AccountsService } from 'src/app/services/accounts.service';
@Component({
  selector: 'app-userrequest',
  templateUrl: './userrequest.component.html'
})
export class UserrequestComponent implements OnInit {
 allActiveRequest: UserRequestModel[]=[];
  constructor(private accountService: AccountsService, private route: Router) { }

  ngOnInit(): void {
    this.accountService.GetAllActiveRequestLog().subscribe(resp => {
      this.allActiveRequest = resp;
    });
  }
  
  exporttoexcel(id: string) {
    this.accountService.ExportToExcel(id);
  }

  RouteToUserDetails(userid?:string){
    let url = "/admin/user/" + userid;
    this.route.navigate([url])
  }
}
