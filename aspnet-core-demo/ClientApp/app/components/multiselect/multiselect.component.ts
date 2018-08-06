import { Component, ViewEncapsulation, Input, Output, OnInit, ViewChild, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, Renderer, ElementRef, forwardRef } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, throttleTime } from 'rxjs/operators';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EqualPipe } from '../../pipes';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(items: any, filter: any, isAnd: Boolean): any {
        if (filter && Array.isArray(items)) {
            let filterKeys = Object.keys(filter);
            if (isAnd) {
                return items.filter(item =>
                    filterKeys.reduce((memo, keyName) =>
                        (memo && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] === "", true));
            } else {
                return items.filter(item => {
                    return filterKeys.some((keyName) => {
                        console.log(keyName);
                        return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] === "";
                    });
                });
            }
        } else {
            return items;
        }
    }
}

const MULTISELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Multiselect),
    multi: true
};

@Component({
    selector: 'multiselect',
    templateUrl: './multiselect.component.html',
    styleUrls: ['./multiselect.component.css'],
    host: true ? { '(change)': 'manualChange($event)', '(document:click)': 'hostClick($event)' } : {},
    providers: [MULTISELECT_VALUE_ACCESSOR],
    encapsulation: ViewEncapsulation.None, // needed for styles to work
})

export class Multiselect implements OnInit, ControlValueAccessor {
    public _items: Array<any>;
    public _selectedItems: Array<any>;
    public localHeader: string;
    public isOpen: Boolean = false;
    public enableFilter: Boolean;
    public filterText: string;
    public filterPlaceholder: string;
    public filterInput = new FormControl();
    private _subscription: Subscription;
    @Input() items: Observable<any[]>;
    @Input() header: string = "Select some stuff";
    @Input() selectedHeader: string = "options selected";

    // ControlValueAccessor Interface and mutator
    private _onChange = (_: any) => { };
    private _onTouched = () => { };

    constructor(private _elRef: ElementRef, private _renderer: Renderer, private _equalPipe: EqualPipe, private _changeDetectorRef: ChangeDetectorRef) {
    }

    get selected(): any {
        return this._selectedItems;
    };

    writeValue(value: any) {
        console.log('writing value ' + value);
        if (value !== undefined) {
            this._selectedItems = value;
        } else {
            this._selectedItems = [];
        }
    }

    setHeaderText() {
        this.localHeader = this.header;
        var isArray = this._selectedItems instanceof Array;
        if (isArray && this._selectedItems.length > 1) {
            this.localHeader = this._selectedItems.length + ' ' + this.selectedHeader;
        } else if (isArray && this._selectedItems.length === 1) {
            this.localHeader = this._selectedItems[0].label;
        }
        console.log("Set header text " + this.localHeader);
    }

    registerOnChange(fn: (value: any) => any): void { this._onChange = fn; console.log(fn); }
    registerOnTouched(fn: () => any): void { this._onTouched = fn; }

    setDisabledState(isDisabled: boolean): void {
        this._renderer.setElementProperty(this._elRef.nativeElement, 'disabled', isDisabled);
        //    if (this.isOpen()) {
        //      this._cRef.instance.setDisabledState(isDisabled);
        //    }
    }

    manualChange() {
        this._onChange(this._selectedItems);
    }

    select(item: any) {
        item.checked = !item.checked;
        this._selectedItems = this._equalPipe.transform(this._items, { checked: true });
        this.setHeaderText();
        this._onChange(this._selectedItems);
    }

    toggleSelect() {
        this.isOpen = !this.isOpen;
    }

    clearFilter() {
        this.filterText = "";
    }

    hostClick(event) {
        if (this.isOpen && !this._elRef.nativeElement.contains(event.target))
            this.isOpen = false;
    }

    ngOnInit() {
        this._subscription = this.items.subscribe(res => this._items = res);
        this.enableFilter = true;
        this.filterText = "";
        this.filterPlaceholder = "Filter..";
        this._selectedItems = this._equalPipe.transform(this._items, { checked: true });
        this.setHeaderText();
        this.filterInput
            .valueChanges
            .pipe(debounceTime(200))
            .pipe(distinctUntilChanged())
            .subscribe(term => {
                this.filterText = term;
                this._changeDetectorRef.markForCheck();
                console.log(term);
            });
    }
}
