import { Component, Input, Output, Injectable, ApplicationRef, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { PipeTransform, OnInit, OnDestroy, Optional } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { DataService, LoremIpsumService } from '../../services';
import { Observable, Subject, Subscription, Subscriber, BehaviorSubject } from 'rxjs';
import { CustomTableEmitter } from "../";

export class CustomTableColumnDefinition {
    public name: string = '';
    public value: string = '';
    public binding: string = '';
    public filter?: string = '';
    public computedClass?: any;
    public isComputed?: boolean = false;
    public isNumeric?: boolean = false;
    public isAnchor?: boolean = false;
    public isWatched?: boolean = true;
    public isHoverOver?: boolean = false;
    public isCheckbox?: boolean = false;
    public isDisabledCheckbox?: boolean = false;
    public isExclusive?: boolean = false;
    public isSelected?: boolean = true;
    public hoverVisibility?: string = '';
    public hoverBinding?: string = '';
    public routerLink?: string = '';
    public style?: any;
}

export class CustomTableConfig {
    public sortBy: string = '';
    public sortDirection: string = 'desc';
    public pageSize: number = 100;
    public pageNumber?: number = 1;
    public totalCount?: number = 0;
    public totalPages?: number = 0;
    public lowerRange?: number = 0;
    public upperRange?: number = 0;
    public maxSize: number = 10;
    public showSelectCheckbox: boolean = true;
    public showSelectAll: boolean = true;
    public showSort: boolean = true;
    public clientSort: boolean = false;
    public clientPaging: boolean = false;
    public stickyHeader: boolean = true;
    public stickyHeaderOffset: number = 0;
    public stickyContainer: string = '';
}

export class CustomTableOptions {
    public records: Observable<Array<any>>;
    public columns: Array<CustomTableColumnDefinition>;
    public rowDefns?: Array<any> = [];
    public config: CustomTableConfig;
    public callbacks?: any;
}

@Component({
    selector: 'custom-table',
    templateUrl: './customTable.component.html',
    styleUrls: ['./customTable.component.css'],
    providers: [CurrencyPipe, DatePipe, DecimalPipe, PercentPipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CustomTable implements OnInit {
    private _subscription: Subscription;
    private _start: Date;
    private _end: Date;
    private _isSorting: Boolean = false;

    public filteredData: Array<any>;
    //public filteredDataObservable: Observable<Array<any>>;
    public filteredDataObservable: BehaviorSubject<Array<any>> = new BehaviorSubject([]);

    @Input() options: CustomTableOptions;
    @Output() sortChange: EventEmitter<any> = new EventEmitter<any>();

    constructor(@Optional() private emitter: CustomTableEmitter, private changeRef: ChangeDetectorRef, private appRef: ApplicationRef,
        private dataSvc: DataService, private lipsumSvc: LoremIpsumService,
        private currencyPipe: CurrencyPipe, private decimalPipe: DecimalPipe,
        private datePipe: DatePipe, private percentPipe: PercentPipe) {
    }

    isSorting(name: string) {
        return this.options.config.sortBy !== name && name !== '';
    };

    isSortAsc(name: string) {
        var isSortAsc: Boolean = this.options.config.sortBy === name && this.options.config.sortDirection === 'asc';
        return isSortAsc;
    };

    isSortDesc(name: string) {
        var isSortDesc: Boolean = this.options.config.sortBy === name && this.options.config.sortDirection === 'desc';
        return isSortDesc;
    };

    sortHeaderClick(headerName: string) {
        if (headerName) {
            if (this.options.config.sortBy === headerName) {
                this.options.config.sortDirection = this.options.config.sortDirection === 'asc' ? 'desc' : 'asc';
            }
            this.options.config.sortBy = headerName;
            this.sortChange.emit();
        }
    }

    setCellValue(row: any, column: CustomTableColumnDefinition, value: any, $event?: Event): any {
        var obj = column.binding.split('.').reduce((prev: any, curr: string) => prev[curr], row);
        console.log("Old value.. " + obj);

        // Presume that an exclusive checkbox requires a selection ... so, if it was true before,
        // don't let it get set to false now.
        if (obj === true) {
            if (column.isCheckbox && column.isExclusive) {
                if ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                }
                return false;
            }
        }

        var key = column.binding;
        if (row.hasOwnProperty(key)) {
            row[key] = value;
            obj = column.binding.split('.').reduce((prev: any, curr: string) => prev[curr], row);
            console.log("New value.. " + obj);
        }
        else {
            console.log("Row doesn't contain property..");
        }

        if (column.isCheckbox && column.isExclusive) {
            for (let r of this.filteredData) {
                if (r !== row) {
                    r[key] = false;
                }
            }

            if (this.emitter) {
                this.emitter.next({ name: 'cellClicked', data: { row: row, column: column, value: value } });
            }
        }
    }

    getRouterLink(row: any, column: CustomTableColumnDefinition): string {
        var index1 = column.routerLink.lastIndexOf('r.');
        var index2 = column.routerLink.lastIndexOf(']');
        var binding = column.routerLink.substring(index1, index2);
        let evalfunc = new Function('r', 'return ' + binding);
        let evalresult: string = evalfunc(row);
        //var routerLink = column
        //    .routerLink
        //    .replace(binding, "'" + evalresult.toString() + "'")
        //    .replace('[', '');
        var routerLink = column
            .routerLink
            .replace(binding, '')
            .replace('[', '')
            .replace(']', '')
            .replace(/'/g, '')
            .replace(",", '')
            .trim() + '/' + evalresult;
        //console.log(routerLink);
        return routerLink;
    }

    getCellValue(row: any, column: CustomTableColumnDefinition): string {
        var result: string = '';
        if (column.isComputed) {
            let evalfunc = new Function('r', 'return ' + column.binding);
            result = evalfunc(row);
        } else {
            result = column.binding.split('.').reduce((prev: any, curr: string) => prev[curr], row);
        }

        if (column.filter) {
            if (column.filter === "currency") {
                result = this.currencyPipe.transform(result);
            }

            if (column.filter.indexOf("date=") !== -1) {
                var filter = column.filter.replace("date=", "");
                result = this.datePipe.transform(result, filter);
            }
        }

        return result;
    }

    ngOnInit() {
        this._subscription = this.options.records.subscribe(res => {
            // Use a BehaviorSubject to emit to the tristate checkbox
            this.filteredDataObservable.next(res);
            this.filteredData = res;
            this.changeRef.markForCheck();
            console.log("Got data.. " + this.filteredData.length);
            //this.zone = new NgZone({enableLongStackTrace: false});
            //this.zone.run(() => {
            //  console.log('Received table data');
            //});
        });
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}
