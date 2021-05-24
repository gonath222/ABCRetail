import { Directive, ElementRef, HostListener, Renderer2, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const DATE_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateValueAccessor),
    multi: true
};

@Directive({
    selector: '[useValueAsDate]',
    providers: [DATE_VALUE_ACCESSOR]
})
export class DateValueAccessor implements ControlValueAccessor {

    @HostListener('input', ['$event.target.valueAsDate'])
    public onChange = (_: any) => { };

    @HostListener('blur')
    public onTouched = () => { };

    constructor(private _renderer: Renderer2, private _elementRef: ElementRef) { }

    public writeValue(value: Date): void {
        if (value != null && value.toString() != "") {
            this._renderer.setProperty(this._elementRef.nativeElement, 'valueAsDate', value);
        }
    }

    public registerOnChange(fn: (_: any) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
}