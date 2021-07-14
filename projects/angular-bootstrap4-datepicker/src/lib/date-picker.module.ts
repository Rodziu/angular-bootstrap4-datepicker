/*
 * Angular DatePicker & TimePicker plugin
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

import {NgModule} from '@angular/core';
import {DatePickerDatePickerModule} from './datepicker/date-picker.module';
import {TimePickerModule} from './timepicker/time-picker.module';

@NgModule({
    imports: [
        DatePickerDatePickerModule,
        TimePickerModule
    ],
    exports: [
        DatePickerDatePickerModule,
        TimePickerModule
    ]
})
export class DatePickerModule {

}
