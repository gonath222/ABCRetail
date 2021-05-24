import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserAccountModel } from 'src/app/models/UserAccountModel';
import { AccountsService } from 'src/app/services/accounts.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {

  userActive = "Active";
  userRecent = "NotActive";
  NoSavingAccount = 0;
  NoPLAccount = 0;
  NoCCAccount = 0;
  TotalSavingsAsset = 0;
  TotalPLAsset = 0;
  TotalCCAsset = 0;
  constructor(private accountService: AccountsService, private route: ActivatedRoute, private message:MessageService) { }

  ngOnInit(): void {
    this.message.SetTitle("Admin Dashboard | ABC Retail Bank");
    this.message.IsLoadinginProgressSubjective.next(true);
    this.accountService.GetAllAccountDetails().subscribe(data => {
      this.ConstructDashBoard(data);
      this.message.IsLoadinginProgressSubjective.next(false);
    });
  }

  ConstructDashBoard(data: UserAccountModel[]) {
    const acc = data.map(account => {
      return account.Accounts;
    });

    let dsa = acc.map(acco => {
      return acco.find(a => {
        return (a.AccountType == "dsa" && a.IsActiveAccount) ?? a.AccountValue;
      })
    });
    dsa = dsa.filter(item => !!item);
    let pl = acc.map(acco => {
      return acco.find(a => {
        return ((a.AccountType == "pl") && a.IsActiveAccount) ?? a.AccountValue;
      })
    });
    pl = pl.filter(item => !!item);
    let carl = acc.map(acco => {
      return acco.find(a => {
        return (a.AccountType == "carl" && a.IsActiveAccount) ?? a.AccountValue;
      })
    });
    carl = carl.filter(item => !!item);
    let cc = acc.map(acco => {
      return acco.find(a => {
        return (a.AccountType == "cc" && a.IsActiveAccount) ?? a.AccountValue;
      })
    });
    cc = cc.filter(item => !!item);


    this.NoSavingAccount = dsa[0] != undefined ? dsa.length : 0;
    this.NoPLAccount = carl[0] != undefined ? carl.length : 0;
    this.NoPLAccount += pl[0] != undefined ? pl.length : 0;
    this.NoCCAccount = cc[0] != undefined ? cc.length : 0;

    dsa.forEach(a => {
      this.TotalSavingsAsset += !!a ? +a?.AccountValue : 0;
    })

    pl.forEach(a => {
      this.TotalPLAsset += !!a ? +a?.AccountValue : 0;
    })

    carl.forEach(a => {
      this.TotalPLAsset += !!a ? +a?.AccountValue : 0;
    })

    cc.forEach(a => {
      this.TotalCCAsset += !!a ? +a?.AccountValue : 0;
    })
  }

}
