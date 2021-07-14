/*
 * Angular DatePicker & TimePicker plugin
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

import DateExtended from 'date-extensions';

export type disabledDatesFn = (locals: { date: Date | string | number, mode: 'year' | 'month' | 'day' }) => boolean;

export abstract class AbstractEnabledDates {
    abstract disabledDates?: (date: DateExtended, mode: 'year' | 'month' | 'day') => boolean;
    _minDate?: DateExtended;
    _maxDate?: DateExtended;

    unknownToDate(obj: unknown, format?: string): DateExtended | undefined {
        try {
            if (obj instanceof DateExtended) {
                return obj.clone();
            } else if (obj instanceof Date) {
                return DateExtended.createFromDate(obj);
            } else if (typeof obj === 'number') {
                return new DateExtended(obj);
            } else if (typeof obj === 'string') {
                if (format) {
                    const newDate = DateExtended.createFromFormat(format, obj);
                    if (newDate.isValid()) {
                        return newDate;
                    }
                }
                return new DateExtended(obj);
            }
        } catch (e) {
            // dummy
        }
        return;
    }

    isEnabledDate(
        date: DateExtended | string,
        mode: 'year' | 'month' | 'day'
    ): boolean {
        if (!(date instanceof Date)) {
            date = new DateExtended(date + '');
        }
        const y = date.getFullYear(),
            m = date.getMonth(),
            d = date.getDate(),
            compare = (compareMode: 'min' | 'max', minMaxDate?: DateExtended): boolean => {
                if (typeof minMaxDate === 'undefined' || !minMaxDate.isValid()) {
                    return true;
                }

                return this.compareDates(y, minMaxDate.getFullYear(), compareMode)
                    || (
                        y === minMaxDate.getFullYear()
                        && (
                            mode === 'year'
                            || this.compareDates(m, minMaxDate.getMonth(), compareMode)
                            || (
                                m === minMaxDate.getMonth()
                                && (
                                    mode === 'month'
                                    || this.compareDates(d, minMaxDate.getDate(), compareMode, true)
                                )
                            )
                        )
                    );
            };
        const ret = compare('min', this._minDate) && compare('max', this._maxDate);
        if (ret && this.disabledDates) {
            return this.disabledDates(date, mode);
        }
        return ret;
    }

    protected compareDates(a: number, b: number, compareMode: 'min' | 'max', equality?: boolean): boolean {
        if (compareMode === 'min') {
            return a > b || (!!equality && a === b);
        } else {
            return a < b || (!!equality && a === b);
        }
    }
}
