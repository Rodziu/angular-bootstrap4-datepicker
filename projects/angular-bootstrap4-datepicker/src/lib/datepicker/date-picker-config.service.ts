/*
 * Angular DatePicker & TimePicker plugin
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
import DateExtended from 'date-extensions';
import {Injectable} from '@angular/core';

export interface IMonthName {
    name: string,
    number: number
}

export interface IDatePickerOptions {
    minDate?: DateExtended,
    maxDate?: DateExtended,
    showIcon: boolean,
    hideOnPick: boolean,
    dayNames: string[],
    monthNames: IMonthName[][],
    format: string,
    modelFormat: string,
    inputFormatter?: (input: string) => string
    /**
     * Call this whenever you change default locale in DateExtended
     */
    updateDateTranslations: () => void
}

@Injectable({
    providedIn: 'root'
})
export class DatePickerConfigService implements IDatePickerOptions {
    minDate?: DateExtended;
    maxDate?: DateExtended;
    showIcon = true;
    hideOnPick = false;
    dayNames: string[] = [];
    monthNames: IMonthName[][] = [];
    inputFormatter?: (input: string) => string;
    format = 'Y-m-d';
    modelFormat = 'Y-m-d';

    constructor() {
        this.updateDateTranslations();
    }

    /**
     * Call this whenever you change default locale in DateExtended
     */
    updateDateTranslations(): void {
        this.dayNames = DateExtended.getDayShortNames();
        this.dayNames.push(this.dayNames.shift() as string);
        this.monthNames = [];
        for (let i = 0; i < 3; i++) {
            const row: IMonthName[] = [];
            for (let j = 0; j < 4; j++) {
                const number = (i * 4) + j + 1;
                row.push({
                    name: DateExtended.getMonthShortNames()[number - 1],
                    number: number
                });
            }
            this.monthNames.push(row);
        }
    }
}
