/*
 * Angular DatePicker & TimePicker plugin
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
import {Component, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {TimePickerConfigService} from '../time-picker-config.service';

@Component({
    selector: 'time-selector',
    templateUrl: './time-selector.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: TimeSelectorComponent
        },
    ]
})
export class TimeSelectorComponent implements ControlValueAccessor {
    @Input() pickHours: boolean;
    @Input() pickMinutes: boolean;
    @Input() pickSeconds: boolean;
    mode: 'hours' | 'minutes' | 'seconds' | 'picker' = 'picker';

    hours = 0;
    minutes = 0;
    seconds = 0;

    private _onChange?: (value: unknown) => void;
    private _onTouched?: () => void;
    private _wasTouched = false;

    constructor(
        public config: TimePickerConfigService
    ) {
        this.pickHours = config.pickHours;
        this.pickMinutes = config.pickMinutes;
        this.pickSeconds = config.pickSeconds;
    }


    writeValue(obj: unknown): void {
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;

        if (typeof obj !== 'string') {
            return;
        }

        try {
            let h = 0, m = 0, s = 0,
                hasM = false;
            obj.split(':').some((value, idx) => {
                switch (idx) {
                    case 0:
                        if (this.pickHours) {
                            h = parseInt(value);
                        } else if (this.pickMinutes) {
                            m = parseInt(value);
                            hasM = true;
                        } else if (this.pickSeconds) {
                            s = parseInt(value);
                            return true;
                        }
                        break;
                    case 1:
                        if (this.pickMinutes && !hasM) {
                            m = parseInt(value);
                        } else if (this.pickSeconds) {
                            s = parseInt(value);
                            return true;
                        }
                        break;
                    case 2:
                        if (this.pickSeconds) {
                            s = parseInt(value);
                        }
                        return true;
                }
                return false;
            });
            if (!isNaN(h) && !isNaN(m) && !isNaN(s)) {
                this.hours = h;
                this.minutes = m;
                this.seconds = s;
            }
        } catch (e) {
            //
        }
    }

    registerOnChange(fn: (value: unknown) => void): void {
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

    setMode(mode: 'hours' | 'minutes' | 'seconds'): void {
        this.mode = mode;
        this.markAsTouched();
    }

    change(mode: 'hours' | 'minutes' | 'seconds', increment = false): void {
        const limit = mode === 'hours' ? 23 : 59;
        if (increment) {
            this[mode]++;
        } else {
            this[mode]--;
        }
        if (this[mode] > limit) {
            this[mode] = 0;
        } else if (this[mode] < 0) {
            this[mode] = limit;
        }
        this.updateModel();
    }

    private updateModel(): void {
        if (!this._onChange) {
            return;
        }
        this.markAsTouched();

        const val = [];
        if (this.pickHours) {
            val.push(this.hours < 10 ? '0' + this.hours : this.hours);
        }
        if (this.pickMinutes) {
            val.push(this.minutes < 10 ? '0' + this.minutes : this.minutes);
        }
        if (this.pickSeconds) {
            val.push(this.seconds < 10 ? '0' + this.seconds : this.seconds);
        }

        this._onChange(val.join(':'));
    }

    pick(mode: 'hours' | 'minutes' | 'seconds' | 'picker', value: string): void {
        if (mode === 'picker') {
            return;
        }

        this[mode] = parseInt(value);
        this.mode = 'picker';
        this.updateModel();
    }
}
