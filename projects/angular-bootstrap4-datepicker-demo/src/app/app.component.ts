/*
 * Angular DatePicker & TimePicker plugin
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

import {Component} from '@angular/core';
import DateExtended from 'date-extensions';
import {FormControl} from '@angular/forms';
import {SectionDirective} from './section.directive';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    nav: SectionDirective[] = [];

    isDisabled = false;
    date = (new DateExtended()).format('Y-m-d');
    minDateControl = new FormControl((new DateExtended()).format('Y-m-d'));
    maxDateControl = new FormControl((new DateExtended()).format('Y-m-d'));
    invalidDate = 'not a date';

    disabledDates(date: DateExtended, mode: 'year' | 'month' | 'day'): boolean {
        if (mode === 'day') {
            return parseInt(date.format('N')) < 6;
        }
        return true;
    }

    month = '';
    dateFormat = (new DateExtended()).add(1).format('Y-m-d');
    dateFormatModel = (new DateExtended()).add(1).format('j F Y');
    placeholder = '';

    time = '23:59:59';
    minutesSeconds = '59:59';
    seconds = '59';
    hoursMinutes = '23:59';
    invalidTime = 'invalid time';
    timePlaceholder = '';
}
