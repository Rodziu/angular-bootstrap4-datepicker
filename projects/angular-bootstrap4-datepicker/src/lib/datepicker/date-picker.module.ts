/*
 * Angular DatePicker & TimePicker plugin
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
import {NgModule} from '@angular/core';
import {DatePickerCalendarComponent} from './datepicker-calendar/date-picker-calendar.component';
import {DatePickerComponent} from './datepicker-component/date-picker.component';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        DatePickerCalendarComponent,
        DatePickerComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    exports: [
        DatePickerCalendarComponent,
        DatePickerComponent
    ]
})
export class DatePickerDatePickerModule {
}
