/*
 * Angular DatePicker & TimePicker plugin
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
import {Component, ElementRef, HostListener, Input, OnDestroy} from '@angular/core';
import {DatePickerConfigService} from '../date-picker-config.service';
import {
    ControlValueAccessor,
    FormControl,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR, ValidationErrors,
    Validator
} from '@angular/forms';
import {AbstractEnabledDates} from '../abstract-enabled-dates';
import {Subscription} from 'rxjs';
import DateExtended from 'date-extensions';

@Component({
    selector: 'datepicker',
    templateUrl: './date-picker.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: DatePickerComponent
        },
        {
            provide: NG_VALIDATORS,
            multi: true,
            useExisting: DatePickerComponent
        }
    ]
})
export class DatePickerComponent extends AbstractEnabledDates implements ControlValueAccessor, OnDestroy, Validator {
    @Input() format: string;
    @Input() modelFormat: string;
    @Input() placeholder?: string;
    @Input() showIcon: boolean;
    @Input() hideOnPick: boolean;
    @Input() monthPicker = false;
    @Input() size?: 'sm' | 'lg';
    @Input() disabledDates?: (date: DateExtended, mode: 'year' | 'month' | 'day') => boolean;

    @Input() set minDate(date: string | Date | undefined) {
        this._minDate = this.unknownToDate(date);
    }

    @Input() set maxDate(date: string | Date | undefined) {
        this._maxDate = this.unknownToDate(date);
    }

    isOpen = false;
    isDisabled = false;
    calendarControl = new FormControl();
    inputControl = new FormControl();

    private _onChange?: (value: unknown) => void;
    private _onTouched?: () => void;
    private _wasTouched = false;
    private subscriptions: Subscription[] = [];

    @HostListener('document:click', ['$event.target']) click(target: HTMLElement): void {
        if (this.isOpen && !this.elementRef.nativeElement.contains(target)) {
            this.isOpen = false;
        }
    }

    constructor(
        private config: DatePickerConfigService,
        private elementRef: ElementRef<HTMLElement>
    ) {
        super();
        this.format = this.config.format;
        this.modelFormat = this.config.modelFormat;
        this.showIcon = this.config.showIcon;
        this.hideOnPick = this.config.hideOnPick;

        // view to model change listeners
        const updateModel = (value: unknown): void => {
            if (this._onChange) {
                this._onChange(value);
                if (this.inputControl.touched || this.calendarControl.touched) {
                    this.markAsTouched();
                }
            }
        }
        // from calendar
        this.subscriptions.push(this.calendarControl.valueChanges.subscribe((value: string): void => {
            this.inputControl.setValue(
                this.convertDate(value, this.modelFormat, this.format), {emitEvent: false}
            );
            updateModel(value);
            if (this.hideOnPick) {
                this.isOpen = false;
            }
        }));
        // from input
        this.subscriptions.push(this.inputControl.valueChanges.subscribe((value: string): void => {
            const formatted = this.convertDate(value, this.format, this.modelFormat, true);
            this.calendarControl.setValue(formatted, {emitEvent: false});
            updateModel(formatted);
        }));
    }

    writeValue(obj: unknown): void {
        this.calendarControl.setValue(obj);
        this.inputControl.setValue(this.convertDate(obj, this.modelFormat, this.format));
    }

    registerOnChange(fn: (value: unknown) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
        if (isDisabled) {
            this.inputControl.disable();
        } else {
            this.inputControl.enable();
        }
    }

    markAsTouched(): void {
        if (!this._wasTouched && this._onTouched) {
            this._wasTouched = true;
            this._onTouched();
        }
    }

    validate(): ValidationErrors | null {
        if (this.inputControl.value === '' || typeof this.inputControl.value !== 'string') {
            return null;
        }

        const date = this.unknownToDate(this.inputControl.value, this.format);

        return date instanceof DateExtended && date.isValid() ? null : {
            date: this.inputControl.value
        };
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((s) => s.unsubscribe());
    }

    private convertDate(date: unknown, fromFormat: string, toFormat: string, forceValid = false): unknown {
        const converted = this.unknownToDate(date, fromFormat);
        if (converted && converted.isValid()) {
            return converted.format(toFormat);
        }

        return forceValid ? null : date;
    }
}
