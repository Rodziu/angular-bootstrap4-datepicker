/*
 * Angular DatePicker & TimePicker plugin
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {DatePickerModule} from 'angular-bootstrap4-datepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SectionDirective} from './section.directive';
import {CodeComponent} from './code.component';

@NgModule({
    declarations: [
        AppComponent,
        CodeComponent,
        SectionDirective
    ],
    imports: [
        BrowserModule,
        DatePickerModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
