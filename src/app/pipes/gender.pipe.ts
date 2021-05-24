import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'GenderPipe' })
export class GenderPipe implements PipeTransform {
    transform(value: string): string {
        return value == "M" ? "Male" : "Female";
    }
}