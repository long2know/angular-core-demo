import { Component, Input, Output, Injectable, ApplicationRef, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs/Rx';
import { Pipe, PipeTransform, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { LoremIpsumService } from '../../services/loremIpsum.service';
import { Subscription } from "rxjs/Subscription";

export class CustomTableColumnDefinition {
    public name: string = '';
    public value: string = '';
    public binding: string = '';
    public filter?: string = '';
    public computedClass?: any;
    public isComputed?: Boolean = false;
    public isNumeric?: Boolean = false;
    public isAnchor?: Boolean = false;
    public isWatched?: Boolean = true;
    public isHoverOver?: Boolean = false;
    public hoverVisibility?: string = '';
    public hoverBinding?: string = '';
    public srefBinding?: string = '';
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
    public showSelectCheckbox: Boolean = true;
    public showSelectAll: Boolean = true;
    public showSort: Boolean = true;
    public clientSort: Boolean = false;
    public clientPaging: Boolean = false;
    public stickyHeader: Boolean = true;
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
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CustomTable implements OnInit {
    private _subscription: Subscription;
    private _start: Date;
    private _end: Date;
    private _isSorting: Boolean = false;

    public filteredData: Array<any>;
    public filteredDataObservable: Observable<Array<any>>;
    @Input() options: CustomTableOptions;
    @Output() sortChange: EventEmitter<any> = new EventEmitter<any>();

    constructor(private changeRef: ChangeDetectorRef, private appRef: ApplicationRef, private dataSvc: DataService, private lipsumSvc: LoremIpsumService) {
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

    getCellValue(row: any, column: CustomTableColumnDefinition): string {
        if (column.isComputed) {
            let evalfunc = new Function('r', 'return ' + column.binding);
            let evalresult: string = evalfunc(row);
            return evalresult;
        } else {
            return column.binding.split('.').reduce((prev: any, curr: string) => prev[curr], row);
        }
    }

    ngOnInit() {
        this._subscription = this.options.records.subscribe(res => {
            this.filteredDataObservable = Observable.of(res);
            this.filteredData = res;
            this.changeRef.markForCheck();
            //this.zone = new NgZone({enableLongStackTrace: false});
            //this.zone.run(() => {
            //  console.log('Received table data');
            //});
        });
    }
}
