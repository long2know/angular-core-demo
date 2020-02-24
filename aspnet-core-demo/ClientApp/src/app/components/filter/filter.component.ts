import { Component, Input, Output, OnInit, ViewChild, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, forwardRef, Renderer2 } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, throttleTime, } from 'rxjs/operators';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomTableOptions, CustomTableConfig, CustomTableColumnDefinition } from '../customTable/customTable.component';

@Pipe({
  name: 'customFilter'
})

export class CustomFilterPipe implements PipeTransform {

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

@Component({
  selector: 'filter',
  templateUrl: 'filter.html',
  //pipes: [CustomFilterPipe]
})

export class Filter implements OnInit, ControlValueAccessor {
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
  public filterPipe: CustomFilterPipe = new CustomFilterPipe();
  public filterInput = new FormControl();
  private subscription: Subscription;
  public filteredData: Array<any>;
  @Input() public options: CustomTableOptions;
  @Output() filterChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private _elRef: ElementRef, private _renderer: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.subscription = this.options.records.subscribe(res => {
      this.filteredData = res;
    });
    this.filterText = "";
    this.filterPlaceholder = "Filter..";
    this.filterInput
      .valueChanges
      .pipe(debounceTime(400))
      .pipe(distinctUntilChanged())
      .subscribe(term => {
        this.filterText = term;
        //var newObj = this.options.columns.reduce(function(obj, column) {
        //  obj[column.value] = column;
        //  //obj[column.value + '.filterText'] = this.filterText;
        //  return obj;
        //}, {});
        var arr = this.filterPipe.transform(this.filteredData, this.options.columns, this.filterText, false);
        this.filterChange.emit({ filterData: arr, filterText: this.filterText });
      });
  }
}
