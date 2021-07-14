/*
 * Angular DatePicker & TimePicker plugin
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'datePad'
})
export class DatePadPipe implements PipeTransform {
    transform(value: unknown): any {
        if (typeof value === 'number') {
            return value < 10 ? '0' + value : value;
        }
        return value;
    }
}
