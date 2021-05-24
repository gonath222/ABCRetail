import { Component, OnInit } from '@angular/core';
import { UserDetails } from 'src/app/models/UserDetails';
import { AccountsService } from 'src/app/services/accounts.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApplyAccountComponent } from './apply-account/apply-account.component';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-Userdashboard',
  templateUrl: './dashboard.component.html'
})
export class UserDashboardComponent implements OnInit {

  isUserActive = false;
  NoSavingAccount = "";
  NoPLAccount = "";
  NoCCAccount = "";
  TotalSavingsAsset = 0;
  TotalPLAsset = 0;
  TotalCCAsset = 0;
  constructor(private authService: AuthService, private modalService: NgbModal, private accountService: AccountsService, private message: MessageService) {
  }

  ngOnInit(): void {
    this.message.SetTitle("User Dashboard | ABC Retail Bank");
    this.authService.userDetailsSubject.subscribe(data => {
      if (data.IsActive) {
        this.isUserActive = true;
        this.FetchAccountsData(data);
      }
      else {
        this.isUserActive = false;
      }
    });

    if (this.authService.UserDetails != undefined) {
      this.isUserActive = this.authService.UserDetails.IsActive;
      if (this.isUserActive) {
        this.FetchAccountsData(this.authService.UserDetails);
      }
    }

  }

  ApplyAccount(type: string) {
    const modalRef = this.modalService.open(ApplyAccountComponent);
    modalRef.componentInstance.type = type;
  }

  FetchAccountsData(user: UserDetails) {
    this.accountService.GetAccountDetails(user).subscribe(data => {
      const acc = data.map(account => {
        return account.Accounts;
      });

      const dsa = acc.map(acco => {
        return acco.find(a => {
          return (a.AccountType == "dsa" && a.IsActiveAccount && +a.AccountValue > 0 ) ?? a.AccountValue;
        })
      });

      const pl = acc.map(acco => {
        return acco.find(a => {
          return (a.AccountType == "pl" && a.IsActiveAccount && +a.AccountValue > 0) ?? a.AccountValue;
        })
      });

      const carl = acc.map(acco => {
        return acco.find(a => {
          return (a.AccountType == "carl" && a.IsActiveAccount && +a.AccountValue > 0) ?? a.AccountValue;
        })
      });

      const cc = acc.map(acco => {
        return acco.find(a => {
          return (a.AccountType == "cc" && a.IsActiveAccount && +a.AccountValue > 0)?? a.AccountValue;
        })
      });

      this.NoSavingAccount = dsa[0] != null ? dsa[0].AccountNumber?.toString() : "0";
      this.NoPLAccount = pl[0] != null ? pl[0].AccountNumber?.toString() : "0";
      this.NoPLAccount = this.NoPLAccount.length == 1 ? (carl[0] != null ? carl[0].AccountNumber?.toString() : "0") : this.NoPLAccount;
       this.NoCCAccount = cc[0] != null ? cc[0].AccountNumber?.toString() : "0";

      this.TotalSavingsAsset = 0;
      this.TotalPLAsset = 0;
      this.TotalCCAsset = 0;
      dsa.forEach(a => {
        this.TotalSavingsAsset += a != null ? +a?.AccountValue : 0;
      })

      pl.forEach(a => {
        this.TotalPLAsset += a != null ? +a?.AccountValue : 0;
      })

      carl.forEach(a => {
        this.TotalPLAsset += a != null ? +a?.AccountValue : 0;
      })

      cc.forEach(a => {
        this.TotalCCAsset += a != null ? +a?.AccountValue : 0;
      })

    })
  }

}
