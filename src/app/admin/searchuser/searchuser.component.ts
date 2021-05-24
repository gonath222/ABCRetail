import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDetails } from 'src/app/models/UserDetails';
import { AccountsService } from 'src/app/services/accounts.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-searchuser',
  templateUrl: './searchuser.component.html'
})
export class SearchuserComponent implements OnInit {

  userdetails: UserDetails[] = [];
  email: string = "";
  fname: string = "";
  lname: string = "";
  accountType: string = "";
  gender: string = "";
  aadhar: string = "";
  pancard: string = "";
  sortDir = 1;
  constructor(private accountService: AccountsService, private route: ActivatedRoute, private router: Router, private message: MessageService) { }

  ngOnInit(): void {
    this.message.SetTitle("Admin | Search User | ABC Retail Bank");
    this.route.queryParams.subscribe(
      params => {
        this.accountType = params['accountype'];
        if (this.accountType == undefined) {
          this.accountType = "";
        }
        else {
          this.SearchUser();
          this.sortArr('fname');
        }
      }
    );
  }

  onSearch() {
    this.SearchUser();
  }

  exporttoexcel(id: string) {
    this.accountService.ExportToExcel(id);
  }

  SearchUser() {
    this.message.IsLoadinginProgressSubjective.next(true);
    this.accountService.GetAllUserDetails().subscribe(resp => {
      this.userdetails = [];
      resp.filter(user => {
        const account = user.AType.filter(acco => {
          return acco.Types == this.accountType ?? acco;
        });

        if ((this.fname != "" && user.FName.toLowerCase().includes(this.fname.toLowerCase())) || account[0]?.IsActive
          || (this.lname != "" && user.LName.toLowerCase().includes(this.lname.toLowerCase()))
          || (this.gender != "" && user.Gender.toLowerCase().includes(this.gender.toLowerCase()))
          || (this.aadhar != "" && user.AadharNumber.toString().includes(this.aadhar))
          || (this.pancard != "" && user.PanCard.toLowerCase().includes(this.pancard.toLowerCase()))
          || (this.email != "" && user.Email.toLowerCase().includes(this.email.toLowerCase()))) {
          this.userdetails.push(user);
        }
      })
      this.message.IsLoadinginProgressSubjective.next(false);
    })
  }

  onSortClick(event: any, field: string) {
    let target = event.currentTarget,
      classList = target.classList;

    if (classList.contains('fa-chevron-up')) {
      classList.remove('fa-chevron-up');
      classList.add('fa-chevron-down');
      this.sortDir = -1;
    } else {
      classList.add('fa-chevron-up');
      classList.remove('fa-chevron-down');
      this.sortDir = 1;
    }
    this.sortArr(field);
  }

  sortArr(colName: string) {
    switch (colName) {
      case "fname":
        return this.userdetails.sort((a, b) => a.FName.localeCompare(b.FName) * this.sortDir);
      case "lname":
        return this.userdetails.sort((a, b) => a.LName.localeCompare(b.LName) * this.sortDir);
      case "registeredon":
        if (this.sortDir == 1) {
          return this.userdetails.sort((b, a) => new Date(b.RegisteredDate).getTime() - new Date(a.RegisteredDate).getTime());
        }
        else {
          return this.userdetails.sort((a, b) => new Date(b.RegisteredDate).getTime() - new Date(a.RegisteredDate).getTime());
        }
      default:
        return this.userdetails.sort((a, b) => a.FName.localeCompare(b.FName) * this.sortDir);
    }
  }

  RouteToUserDetails(userid?:string){
    let url = "/admin/user/" + userid;
    this.router.navigate([url])
  }
}
