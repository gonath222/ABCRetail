import { Pipe, PipeTransform } from '@angular/core';
import state from '../appjsons/states.json';

@Pipe({ name: 'StatePipe' })
export class StatePipe implements PipeTransform {
    public stateList: { code: string, name: string }[] = state;
    transform(value: string): string {
        let statename: string ="";
        let exp = this.stateList.filter(state => {
            if(state.code == value)
            {
                statename = state.name;
            }
        });
        return statename;
    }
}