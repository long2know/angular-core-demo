import { Component, Input, Output, OnInit, ViewChild, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, Renderer, ElementRef, forwardRef } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomTableOptions, CustomTableConfig, CustomTableColumnDefinition } from '../customTable/customTable.component';

@Pipe({
    name: 'filterBox'
})

export class FilterBoxPipe implements PipeTransform {
    getCellValue(row: any, column: CustomTableColumnDefinition): string {
        if (column.isComputed) {
            let evalfunc = new Function('r', 'return ' + column.binding);
            let evalresult: string = evalfunc(row);
            return evalresult;
        } else {
            return column.binding.split('.').reduce((prev: any, curr: string) => prev[curr], row);
        }
    }

    transform(items: any, columns: any, filterText: string, isAnd: Boolean): any {
        if (columns && Array.isArray(items)) {
            if (isAnd) {
                return items.filter(item =>
                    columns.reduce((acc, column) => {
                        var evalResult: string = this.getCellValue(item, column);
                        var isMatch = new RegExp(filterText, 'gi').test(evalResult) || filterText === "";
                        return acc && isMatch;
                    }, true));
            } else {
                return items.filter(item => {
                    return columns.some((column) => {
                        var evalResult: string = this.getCellValue(item, column);
                        var isMatch = new RegExp(filterText, 'gi').test(evalResult) || filterText === "";
                        return isMatch;
                    });
                });
            }
        } else {
            return items;
        }
    }
}

export class FilterBoxFilter {
    public filterKey: number = 0;
    public filterText: string;
    public filterColumns: string[];
}

@Component({
    selector: 'filter-box',
    templateUrl: 'filterBox.html',
    styleUrls: ['./filterBox.component.css'],
    host: {
        '(document:click)': 'closeSelector()'
    }
})

export class FilterBox implements OnInit, ControlValueAccessor {
    writeValue(obj: any): void {
        throw new Error("Method not implemented.");
    }
    registerOnChange(fn: any): void {
        throw new Error("Method not implemented.");
    }
    registerOnTouched(fn: any): void {
        throw new Error("Method not implemented.");
    }
    setDisabledState(isDisabled: boolean): void {
        throw new Error("Method not implemented.");
    }
    public filterText: string;
    public filterPlaceholder: string;
    public filterPipe: FilterBoxPipe = new FilterBoxPipe();
    public filters: FilterBoxFilter[] = [];
    public columnSelectorOpen: boolean = false;
    public filterKey: number = 0;
    public filterInput = new FormControl();
    private subscription: Subscription;
    public filteredData: Array<any>;
    @Input() public options: CustomTableOptions;
    @Output() filterChange: EventEmitter<any> = new EventEmitter<any>();

    constructor(private _elRef: ElementRef, private _renderer: Renderer,
        private _changeDetectorRef: ChangeDetectorRef) { }

    closeSelector() {
        this.columnSelectorOpen = false;
    }

    removeFilter(filterKey: number) {
        let filter = this.filters.find(f => f.filterKey === filterKey);
        if (filter) {
            let index: number = this.filters.indexOf(filter, 0);
            this.filters.splice(index, 1);
        }
    }

    addFilter() {
        this.closeSelector();
        this.filterText = <string>this.filterInput.value;
        var selectedColumns = this.options.columns.filter(column => column.isSelected);
        var columnBindings = selectedColumns.map(column => column.binding);
        if (columnBindings.length > 0 && this.filterText && this.filterText.length) {
            let filter: FilterBoxFilter = {
                filterKey: this.filterKey++,
                filterText: this.filterText,
                filterColumns: columnBindings
            };
            this.filters.push(filter);
        }
        this.filterText = "";
        this.filterInput.setValue(this.filterText);
        this.filterChange.emit({ filterData: this.filters });
    }

    ngOnInit() {
        this.subscription = this.options.records.subscribe(res => {
            this.filteredData = res;
        });
        this.filterText = "";
        this.filterPlaceholder = "Filter..";
        //this.filterInput
        //    .valueChanges
        //    .debounceTime(400)
        //    .distinctUntilChanged()
        //    .subscribe(term => {
        //        this.filterText = term;
        //        var arr = this.filterPipe.transform(this.filteredData, this.options.columns, this.filterText, false);
        //        // this.filterChange.emit({ filterData: arr, filterText: this.filterText });
        //    });
    }
}
