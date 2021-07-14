/*
 * Angular DatePicker & TimePicker plugin
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
import {Injectable} from '@angular/core';

export interface ITimePickerOptions {
    pickHours: boolean,
    pickMinutes: boolean,
    pickSeconds: boolean,
    showIcon: boolean,
    hideOnPick: boolean,
    hours: { hour: string }[][],
    minutes: { minute: string }[][]
}

@Injectable({
    providedIn: 'root'
})
export class TimePickerConfigService implements ITimePickerOptions {
    pickHours = true;
    pickMinutes = true;
    pickSeconds = true;
    showIcon = true;
    hideOnPick = false;
    hours: { hour: string }[][] = [];
    minutes: { minute: string }[][] = [];

    constructor() {
        let i, j;
        for (i = 0; i < 10; i++) {
            const hoursRow: { hour: string }[] = [],
                minutesRow: { minute: string }[] = [];
            for (j = 0; j < 6; j++) {
                if (i < 6 && j < 4) {
                    const hours = (i * 4) + j;
                    hoursRow.push({
                        hour: hours < 10 ? '0' + hours : hours.toString()
                    });
                }
                const minute = (i * 6) + j;
                minutesRow.push({
                    minute: minute < 10 ? '0' + minute : minute.toString()
                });
            }
            this.hours.push(hoursRow);
            this.minutes.push(minutesRow);
        }
    }
}
