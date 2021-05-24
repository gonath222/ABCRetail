import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetails } from 'src/app/models/UserDetails';
import { AccountsService } from 'src/app/services/accounts.service';

@Component({
  selector: 'app-activeuser',
  templateUrl: './activeuser.component.html'
})
export class ActiveuserComponent implements OnInit {

  userdetails: UserDetails[] =[];
  constructor(private accountService: AccountsService, private router: Router) { }

  ngOnInit(): void {
    this.accountService.GetAllUserDetails().subscribe(resp =>{
      resp.filter(user =>{
        if(user.IsActive){
        this.userdetails.push(user);
        }
      })
    });
  }
  exporttoexcel(id: string) {
    this.accountService.ExportToExcel(id);
  }

  RouteToUserDetails(userid?:string){
    let url = "/admin/user/" + userid;
    this.router.navigate([url])
  }
}
