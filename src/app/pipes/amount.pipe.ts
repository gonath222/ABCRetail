import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'AmountPipe' })
export class AmountPipe implements PipeTransform {
    transform(value: number): string {
        return "INR " + value.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}