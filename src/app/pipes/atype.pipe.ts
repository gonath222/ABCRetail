import { Pipe, PipeTransform } from '@angular/core';
import Accounttype from '../appjsons/atype.json';

@Pipe({ name: 'AccountTypePipe' })
export class AccountTypePipe implements PipeTransform {
    public accountType: { code: string, name: string }[] = Accounttype;
    transform(value: string): string {
        let accountName: string ="";
        let exp = this.accountType.filter(atype => {
            if(atype.code == value)
            {
                accountName = atype.name;
            }
        });
        return accountName;
    }
}