/*
 * Angular DatePicker & TimePicker plugin
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
import {Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DatePickerConfigService} from '../date-picker-config.service';
import DateExtended from 'date-extensions';
import {AbstractEnabledDates} from '../abstract-enabled-dates';

@Component({
    selector: 'datepicker-calendar',
    templateUrl: './date-picker-calendar.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: DatePickerCalendarComponent
        }
    ]
})
export class DatePickerCalendarComponent extends AbstractEnabledDates implements ControlValueAccessor, OnInit {
    @Input() modelFormat: string;
    @Input() monthPicker = false;
    @Input() disabledDates?: (date: DateExtended, mode: 'year' | 'month' | 'day') => boolean;

    @Input() set minDate(date: string | Date | undefined) {
        this._minDate = this.unknownToDate(date);
    }

    @Input() set maxDate(date: string | Date | undefined) {
        this._maxDate = this.unknownToDate(date);
    }

    displayMode: 'months' | 'days' | 'years' = 'days';
    daysData: DateExtended[][] = [];
    yearsData: number[][] = [];

    currentDate?: DateExtended;
    currentDisplayDate?: DateExtended;
    private _lastRenderedDate?: DateExtended;

    private _onChange?: (value: string) => void;
    private _onTouched?: () => void;
    private _wasTouched = false;

    constructor(
        public config: DatePickerConfigService
    ) {
        super();
        this.modelFormat = this.config.modelFormat;
        this._minDate = this.config.minDate;
        this._maxDate = this.config.maxDate;
    }

    ngOnInit(): void {
        this.displayMode = this.monthPicker ? 'months' : 'days';
    }

    writeValue(obj: unknown): void {
        let newDate = this.unknownToDate(obj, this.modelFormat) || new DateExtended();
        if (
            newDate.isValid()
            && (
                !(this.currentDate instanceof DateExtended)
                || newDate.format('Y-m-d') !== this.currentDate.format('Y-m-d')
            )
        ) {
            this.currentDate = newDate;
            this.currentDisplayDate = newDate.clone();
        } else if (typeof this.currentDisplayDate === 'undefined') {
            newDate = new DateExtended();
            this.currentDate = newDate;
            this.currentDisplayDate = newDate.clone();
        }
        this.buildCalendar();
    }

    registerOnChange(fn: (value: string) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    markAsTouched(): void {
        if (!this._wasTouched && this._onTouched) {
            this._wasTouched = true;
            this._onTouched();
        }
    }

    buildCalendar(): void {
        if (
            this.displayMode === 'months'
            || typeof this.currentDate === 'undefined'
            || typeof this.currentDisplayDate === 'undefined'
        ) {
            return;
        }
        if (this.displayMode === 'days') {
            if (
                typeof this._lastRenderedDate === 'undefined'
                || this.currentDisplayDate.format('Y-m') !== this._lastRenderedDate.format('Y-m')
            ) {
                this.daysData = [];
                this._lastRenderedDate = this.currentDisplayDate.clone();
                const firstDay = new DateExtended(
                    this.currentDisplayDate.format('Y-m-01')
                );
                let wd = parseInt(firstDay.format('N')) - 1;
                if (wd === 0) {
                    wd = 7;
                }
                firstDay.sub(wd, 'day');
                let row: DateExtended[] = [];
                for (let i = 1; i < 43; i++) {
                    row.push(firstDay.clone());
                    if (i % 7 === 0) {
                        this.daysData.push(row);
                        row = [];
                    }
                    firstDay.add(1);
                }
            }
        } else {
            this.yearsData = [];
            const firstYear = Math.floor(this.currentDisplayDate.getFullYear() / 12) * 12;
            for (let i = 0; i < 3; i++) {
                const row: number[] = [];
                for (let j = 0; j < 4; j++) {
                    const year = firstYear + ((i * 4) + j);
                    row.push(year);
                }
                this.yearsData.push(row);
            }
        }
    }

    changeMode(mode: 'months' | 'days' | 'years'): void {
        if (this.displayMode !== mode) {
            this.markAsTouched();
            this.displayMode = mode;
            this.buildCalendar();
        }
    }

    isEnabledDate(date: DateExtended | string, mode: 'year' | 'month' | 'day'): boolean {
        return super.isEnabledDate(date, mode);
    }

    validDisplayAction(mode: 'prev' | 'next'): DateExtended | false {
        if (typeof this.currentDisplayDate === 'undefined') {
            return false;
        }

        const date = this.currentDisplayDate.clone();
        switch (this.displayMode) {
            case 'days':
                date.sub(mode === 'prev' ? 1 : -1, 'month');
                return this.isEnabledDate(date, 'month') ? date : false;
            case 'months':
                date.sub(mode === 'prev' ? 1 : -1, 'year');
                return this.isEnabledDate(date, 'year') ? date : false;
            case 'years': {
                const year = (Math.floor(this.currentDisplayDate.getFullYear() / 12) * 12)
                    + (mode === 'prev' ? -1 : 12);
                if (this.isEnabledDate(new DateExtended(year + ''), 'year')) {
                    return date.sub(mode === 'prev' ? 12 : -12, 'year');
                }
                break;
            }
        }
        return false;
    }

    displayAction(mode: 'prev' | 'next'): void {
        const valid = this.validDisplayAction(mode);
        if (valid) {
            this.markAsTouched();
            this.currentDisplayDate = valid;
            this.buildCalendar();
        }
    }

    pickDate(date: DateExtended | string | number, mode: 'day' | 'month' | 'year'): void {
        if (typeof this.currentDate === 'undefined' || typeof this.currentDisplayDate === 'undefined') {
            return;
        }

        if (!(date instanceof DateExtended)) {
            date = new DateExtended(date + '');
        }

        if (!this.isEnabledDate(date, mode)) {
            return;
        }

        this.markAsTouched();

        switch (mode) {
            case 'day':
                if (this._onChange) {
                    this._onChange(date.format(this.modelFormat));
                }
                this.currentDate = date;
                this.currentDisplayDate = date;
                this.buildCalendar();
                break;
            case 'month':
                this.currentDisplayDate.setMonth(date.getMonth());
                if (this.monthPicker) {
                    this.currentDisplayDate.setDate(1);
                    this.pickDate(this.currentDisplayDate, 'day');
                } else {
                    this.changeMode('days');
                }
                break;
            case 'year':
                this.currentDisplayDate.setFullYear(parseInt(date.format('Y')));
                this.changeMode('months');
                break;
        }
    }
}
