import {NgModule} from '@angular/core';
import {TimeSelectorComponent} from './time-selector/time-selector.component';
import {CommonModule} from '@angular/common';
import {DatePadPipe} from './date-pad.pipe';
import {TimePickerComponent} from './timepicker-component/time-picker.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        DatePadPipe,
        TimePickerComponent,
        TimeSelectorComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    exports: [
        DatePadPipe,
        TimePickerComponent,
        TimeSelectorComponent
    ]
})
export class TimePickerModule {

}
