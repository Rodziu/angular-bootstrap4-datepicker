/*
 * Angular validation plugin for  Bootstrap 4
 *  Copyright (c) 2019-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {Directive, ElementRef, Host, Input, OnInit, Optional, SkipSelf} from '@angular/core';
import {AppComponent} from './app.component';

@Directive({
    selector: 'section',
})
export class SectionDirective implements OnInit {
    @Input() id = '';

    title = '';

    children: SectionDirective[] = [];

    constructor(
        private elementRef: ElementRef<HTMLElement>,
        @Host() private app: AppComponent,
        @Optional() @SkipSelf() @Host() private parent: SectionDirective
    ) {
    }

    ngOnInit(): void {
        this.title = this.elementRef.nativeElement.querySelector('.page-header')?.textContent?.trim() || this.id;

        if (this.parent) {
            this.parent.children.push(this);
        } else {
            this.app.nav.push(this);
        }
    }
}
