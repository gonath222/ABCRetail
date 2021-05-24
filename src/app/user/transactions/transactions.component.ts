import { Component, Input, OnInit } from '@angular/core';
import { UserTransactionModel } from 'src/app/models/UserTransactionModel';
import { AccountsService } from 'src/app/services/accounts.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-Usertransactions',
  templateUrl: './transactions.component.html'
})
export class UserTransactionsComponent implements OnInit {

  sentList: UserTransactionModel[] = [];
  receList: UserTransactionModel[] = [];
  sortDir = 1;
  @Input() searchText : any;
  constructor(private account: AccountsService, private auth: AuthService, private message: MessageService) {
  }

  ngOnInit(): void {
    this.message.SetTitle("User | Transactions | ABC Retail Bank");
    this.message.IsLoadinginProgressSubjective.next(true);
    this.account.GetTransactionDetails(this.auth.UserSessionData.userId).subscribe(data => {
      if (data != null) {
        this.sentList = data.sentTransationList;
        this.receList = data.receTransationList;
        this.message.IsLoadinginProgressSubjective.next(false);
      }
    }
    );
  }

  onSortClick(event: any, field: string, transType: string) {
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
    this.sortArr(field, transType);
  }

  sortArr(colName: string, transType: string) {
    if (transType == "SENT") {
      switch (colName) {
        case "transferedon":
          if (this.sortDir == 1) {
            return this.sentList.sort((b, a) => new Date(b.TransferedOn).getTime() - new Date(a.TransferedOn).getTime());
          }
          else {
            return this.sentList.sort((a, b) => new Date(b.TransferedOn).getTime() - new Date(a.TransferedOn).getTime());
          }
        default:
          return this.sentList;
      }
    }
    else {
      switch (colName) {
        case "transferedon":
          if (this.sortDir == 1) {
            return this.receList.sort((b, a) => new Date(b.TransferedOn).getTime() - new Date(a.TransferedOn).getTime());
          }
          else {
            return this.receList.sort((a, b) => new Date(b.TransferedOn).getTime() - new Date(a.TransferedOn).getTime());
          }
        default:
          return this.receList;
      }
    }
  }

    
  exporttoexcel(id: string) {
    this.account.ExportToExcel(id);
  }
}
