import { Component, Input, Injectable, ApplicationRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Pipe, PipeTransform, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomTable, CustomTableOptions, CustomTableConfig, CustomTableColumnDefinition, Multiselect } from '../';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { distinctUntilChanged, debounceTime, tap, switchMap, catchError, merge } from 'rxjs/operators';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ApiService, DataService, ConfigService, LoremIpsumService } from '../../services';

@Component({
    templateUrl: 'route5.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class Route5Component implements OnInit {
    filterOptions: {
        records: BehaviorSubject<any[]>;
        columns: CustomTableColumnDefinition[];
    };
    public hasChanges: boolean = false;
    public tableOptions: CustomTableOptions;
    public filterOptins: CustomTableOptions;
    public records: Array<any> = [];
    public filteredData: Array<any> = [];
    public pagedData: Array<any> = [];

    public model: any;
    public searching: boolean = false;
    public searchFailed: boolean = false;
    public hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);

    private tableSubject: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public tableObserve: Observable<Array<any>> = this.tableSubject.asObservable();

    private filterSubject: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public filterObserve: Observable<Array<any>> = this.filterSubject.asObservable();

    constructor(private changeRef: ChangeDetectorRef, private appRef: ApplicationRef, private apiService: ApiService,
        private dataSvc: DataService, private lipsumSvc: LoremIpsumService, private configSvc: ConfigService) {
    }

    canDeactivate() {
        console.log("Detecting changes. Has Changes: " + this.hasChanges);
        return of(!this.hasChanges);
    }

    search = (text$: Observable<string>) => {
        return text$
            .pipe(debounceTime(300))
            .pipe(distinctUntilChanged())
            .pipe(tap(() => this.searching = true))
            .pipe(switchMap(term =>
                this.apiService
                    .getUrl("/api/employee?filterText=" + term)
                    .pipe(
                    tap(() => this.searchFailed = false),
                    catchError(() => {
                        this.searchFailed = true;
                        return of([]);
                    }))
            )
            )
            .pipe(tap(() => this.searching = false))
            .pipe(merge(this.hideSearchingWhenUnsubscribed));
    }

    //search = (text$: Observable<string>) =>
    //    text$
    //        .debounceTime(200)
    //        .map(term => term === '' ? []
    //            : [{ 'name': 'Wisconsin', 'flag': '2/22/Flag_of_Wisconsin.svg/45px-Flag_of_Wisconsin.svg.png' },
    //            { 'name': 'Wyoming', 'flag': 'b/bc/Flag_of_Wyoming.svg/43px-Flag_of_Wyoming.svg.png' }]);

    formatter = (x: { name: string }) => x.name;

    public addEmployee(employee: any) {
        var isInList = this.records.filter(item => item.id === employee.id).length > 0;
        if (isInList) {
            console.log("Employee already in list.. " + employee.name);
        }
        else {
            var clonedEmployee = Object.assign({}, employee);
            console.log("Adding employee to list.. " + employee.name);
            this.records.push(clonedEmployee);
            this.filterChange(this.records);
            this.pushFilterData();
        }
    }

    public deleteEmployees() {
        var selectedEmployees = this.records.filter(item => item.isSelected);

        // Splice out what was selected.  Alternatively, we could recreate the original array
        for (let employee of selectedEmployees) {
            var index = this.records.indexOf(employee);
            this.records.splice(index, 1);
        }

        this.filterChange({ filterData: this.records, filterText: "" });
        this.pushFilterData();
    }

    filterChange($event) {
        this.filteredData = $event.filterData;
        this.sortChange(null);
        this.pushChange();
    }

    sortChange($event: any) {
        if (this.tableOptions.config.clientSort) {
            this.dataSvc.sort(this.filteredData, this.tableOptions.config.sortBy, this.tableOptions.config.sortDirection, this.tableOptions.columns);
            if (this.tableOptions.config.clientPaging) {
                this.pageChange(null);
            } else {
                this.pushChange();
            }
        }
    }

    pageChange($event: any) {
        if (this.tableOptions.config.clientPaging) {
            this.pagedData = this.dataSvc.pageData(this.filteredData, this.tableOptions);
            this.pushChange();
        }
    }

    initTableOptions() {
        // Pull column definitions from the server
        var columns = <Array<CustomTableColumnDefinition>>this.configSvc.configData.employeeTableColumns;

        this.tableOptions = {
            records: this.tableSubject,
            columns: columns,
            config: {
                sortBy: "id",
                sortDirection: "asc",
                pageSize: 10,
                pageNumber: 1,
                totalCount: 0,
                totalPages: 0,
                maxSize: 10,
                showSelectCheckbox: true,
                showSelectAll: true,
                showSort: true,
                clientSort: true,
                clientPaging: true,
                //displayPager: true,
                //displayPageSize: true,
                stickyHeader: true,
                stickyHeaderOffset: 0,
                stickyContainer: '.table1-container'
            },
        };

        this.filterOptions = {
            records: this.filterSubject,
            columns: columns
        };

        this.filterChange({ filterData: this.records, filterText: "" });

        // For the filter, we don't want to refresh data, so we push once.
        // This allows the filter to control this.records
        this.pushFilterData();
    }

    pushChange() {
        this.tableSubject.next(this.pagedData);
    }

    pushFilterData() {
        this.filterSubject.next(this.records);
    }

    addItems(count: number) {
        for (var i: number = 0; i < count; i++) {
            var suffix: string = this.records.length.toString();
            var money = (Math.random() * 1000).toFixed(2);
            var date = new Date();
            date.setDate(date.getDate() + this.records.length);
            //this.records.push({
            //    id: suffix, column2: "Column2_" + suffix, column3: "Column3_" + suffix, column4: "Column4_" + suffix, column5: "Column5_" + suffix,
            //    column6: money, column7: "Column7_" + suffix, column8: date, column9: "Column9_" + suffix
            //});

            this.records.push({
                id: suffix, column2: this.lipsumSvc.singleWord(), column3: this.lipsumSvc.singleWord(), column4: this.lipsumSvc.singleWord(), column5: this.lipsumSvc.singleWord(),
                column6: money, column7: this.lipsumSvc.singleWord(), column8: date, column9: this.lipsumSvc.singleWord()
            });
        }
    }

    makeCall() {
        //this.apiService
        //    .getUrl("/api/employee?filterText=St")
        //    .subscribe(res => {
        //        this.records = <Array<any>>res;
        //        this.filterChange(this.records);
        //        this.pushFilterData();
        //    });
    }

    ngOnInit() {
        this.makeCall();
        //this.addItems(10000);
        this.initTableOptions();

        this.tableSubject.subscribe(res => {

        });
    }
}
