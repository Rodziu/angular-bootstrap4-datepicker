/*
 * Angular DatePicker & TimePicker plugin
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
import {Component, ElementRef, HostListener, Input, OnDestroy} from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validator
} from '@angular/forms';
import {Subscription} from 'rxjs';
import {TimePickerConfigService} from '../time-picker-config.service';

@Component({
    selector: 'timepicker',
    templateUrl: './time-picker.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: TimePickerComponent
        },
        {
            provide: NG_VALIDATORS,
            multi: true,
            useExisting: TimePickerComponent
        }
    ]
})
export class TimePickerComponent implements ControlValueAccessor, OnDestroy, Validator {
    @Input() pickHours: boolean;
    @Input() pickMinutes: boolean;
    @Input() pickSeconds: boolean;
    @Input() placeholder?: string;
    @Input() showIcon: boolean;
    @Input() hideOnPick: boolean;
    @Input() size?: 'sm' | 'lg';

    isOpen = false;
    isDisabled = false;
    selectorControl = new FormControl();
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
        private config: TimePickerConfigService,
        private elementRef: ElementRef<HTMLElement>
    ) {
        this.pickHours = config.pickHours;
        this.pickMinutes = config.pickMinutes;
        this.pickSeconds = config.pickSeconds;
        this.showIcon = this.config.showIcon;
        this.hideOnPick = this.config.hideOnPick;

        // view to model change listeners
        const updateModel = (value: unknown): void => {
            if (this._onChange) {
                this._onChange(value);
                if (this.inputControl.touched || this.selectorControl.touched) {
                    this.markAsTouched();
                }
            }
        }
        // from calendar
        this.subscriptions.push(this.selectorControl.valueChanges.subscribe((value: string): void => {
            updateModel(value);
            this.inputControl.setValue(value);
            if (this.hideOnPick) {
                this.isOpen = false;
            }
        }));
        // from input
        this.subscriptions.push(this.inputControl.valueChanges.subscribe((value: string | null): void => {
            if (!this._validate(value)) {
                value = null;
            }
            updateModel(value);
            this.selectorControl.setValue(value, {emitEvent: false});
        }));
    }

    writeValue(obj: unknown): void {
        this.selectorControl.setValue(obj, {emitEvent: false});
        this.inputControl.setValue(obj, {emitEvent: false});
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

    private _validate(value: unknown): boolean {
        if (value === '' || typeof value !== 'string') {
            return true;
        }

        const formatParts: string[] = [];
        if (this.pickHours) {
            formatParts.push('([0-1]?[0-9]|2[0-3])');
        }
        if (this.pickMinutes) {
            formatParts.push('[0-5][0-9]');
        }
        if (this.pickSeconds) {
            formatParts.push('[0-5][0-9]');
        }

        const formatRegex = new RegExp(`^${formatParts.join(':')}$`);

        return formatRegex.test(value);
    }

    validate(): ValidationErrors | null {
        return this._validate(this.inputControl.value) ? null : {
            time: this.inputControl.value
        };
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((s) => s.unsubscribe());
    }
}
