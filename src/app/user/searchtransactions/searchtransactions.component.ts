import { Component, OnInit } from '@angular/core';
import { UserTransactionModel } from 'src/app/models/UserTransactionModel';
import { AccountsService } from 'src/app/services/accounts.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-searchtransactions',
  templateUrl: './searchtransactions.component.html'
})
export class SearchtransactionsComponent implements OnInit {

  transList: UserTransactionModel[] = [];
  transferto: string = "";
  transferdatefrom: string = "";
  sortDir = 1;

  constructor(private message: MessageService, private account: AccountsService, private auth: AuthService) { }

  ngOnInit(): void {
    this.message.SetTitle("User | Search Transactions | ABC Retail Bank");
  }

  onSearch() {
    this.message.IsLoadinginProgressSubjective.next(true);
    this.account.GetTransactionDetails(this.auth.UserSessionData.userId).subscribe(data => {
      if (data != null) {
        const resultList = [];
        data.sentTransationList.filter(sent => {
          sent.TYPE = "OutGoing";
        });

        resultList.push(...data.sentTransationList);
        data.receTransationList.filter(sent => {
          sent.TYPE = "Incoming";
        });

        resultList.push(...data.receTransationList);
        this.transList = [];
        resultList.filter(result => {
          const typeName = this.GetTypeName(this.transferto);
          if (
          (typeName == "dsa" 
          && !result.ToUserName.toLowerCase().includes("personal") 
          && !result.ToUserName.toLowerCase().includes("car loan") 
          && !result.ToUserName.toLowerCase().includes("credit")) ||
          (typeName != "" && result.ToUserName.toLowerCase().includes(typeName)) ||
          new Date(result.TransferedOn).setHours(0,0,0,0) === new Date(this.transferdatefrom).setHours(0,0,0,0)
          ) {
            this.transList.push(result);
          }
        });
        this.message.IsLoadinginProgressSubjective.next(false);
      }
    }
    );
  }

  GetTypeName(type: string) {
    switch (type) {
      case 'dsa':
        return 'dsa';
      case 'pl':
        return "personal";
      case 'carl':
        return "car loan";
      case 'cc':
        return 'credit';
      default:
        return "";
    }
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
      case "transferedon":
        if (this.sortDir == 1) {
          return this.transList.sort((b, a) => new Date(b.TransferedOn).getTime() - new Date(a.TransferedOn).getTime());
        }
        else {
          return this.transList.sort((a, b) => new Date(b.TransferedOn).getTime() - new Date(a.TransferedOn).getTime());
        }
      default:
        return this.transList;
    }
  }

  exporttoexcel(id: string) {
    this.account.ExportToExcel(id);
  }
}
