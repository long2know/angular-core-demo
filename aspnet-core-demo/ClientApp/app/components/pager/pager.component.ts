import { Component, Input, Output, OnInit, ViewChild, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, Renderer, ElementRef, forwardRef } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';
import { DataService } from '../../services/data.service';
import { CustomTableOptions } from "../customTable/customTable.component";

@Component({
    selector: 'pager',
    templateUrl: 'pager.html'
})

export class Pager implements OnInit {
    public firstText: string = "«";
    public lastText: string = "»";
    public previousText: string = "‹";
    public nextText: string = "›";
    public boundaryLinks: boolean = true;
    public directionLinks: boolean = true;
    public rotate: boolean = false;
    public adjacents: number = 2;
    public pages: Array<any>;
    @Input() public options: CustomTableOptions;
    @Output() pageChange: EventEmitter<any> = new EventEmitter<any>();

    constructor(private _elRef: ElementRef, private _renderer: Renderer,
        private changeRef: ChangeDetectorRef) {
    }

    calculateTotalPages() {
        var totalPages = this.options.config.pageSize < 1 ? 1 : Math.ceil(this.options.config.totalCount / this.options.config.pageSize);
        this.options.config.totalPages = Math.max(totalPages || 0, 1);
        return this.options.config.totalPages;
    }

    selectPage(page: number) {
        if (this.options.config.pageNumber !== page && page > 0 && page <= this.options.config.totalPages) {
            this.options.config.pageNumber = page;
            this.pages = this.getPages(this.options.config.pageNumber, this.options.config.totalPages);
            this.pageChange.emit();
        }
    }

    getText(key: string): string {
        return this[key + 'Text'] || this[key + 'Text'];
    }

    noPrevious(): boolean {
        return this.options.config.pageNumber === 1;
    }

    noNext(): boolean {
        return this.options.config.pageNumber === this.options.config.totalPages;
    }

    // Create page object used in template
    makePage(number: number, text: string, isActive: boolean): any {
        return {
            number: number,
            text: text,
            active: isActive
        };
    }

    getPages(currentPage, totalPages) {
        var pages = [];

        // Default page limits
        var startPage: number = 1, endPage: number = totalPages;
        var isMaxSized: boolean = this.options.config.maxSize < totalPages;

        var calcedMaxSize: number = isMaxSized ? this.options.config.maxSize : 0;

        // If we want to limit the maxSize within the constraint of the adjacents, we can do so like this.
        // This adjusts the maxSize based on current page and current page and whether the front-end adjacents are added.
        if (isMaxSized && !this.rotate && this.adjacents > 0 && currentPage >= (calcedMaxSize - 1) && totalPages >= (calcedMaxSize + (this.adjacents * 2))) {
            calcedMaxSize = this.options.config.maxSize - this.adjacents;
        }

        // Adjust max size if we are going to add the adjacents
        if (isMaxSized && !this.rotate && this.adjacents > 0) {
            var tempStartPage = ((Math.ceil(currentPage / calcedMaxSize) - 1) * calcedMaxSize) + 1;
            var tempEndPage = Math.min(tempStartPage + calcedMaxSize - 1, totalPages);

            if (tempEndPage < totalPages) {
                if (totalPages - this.adjacents > currentPage) { // && currentPage > adjacents) {
                    calcedMaxSize = calcedMaxSize - this.adjacents;
                }
            }
        }

        // recompute if maxSize
        if (isMaxSized) {
            if (this.rotate) {
                // Current page is displayed in the middle of the visible ones
                startPage = Math.max(currentPage - Math.floor(calcedMaxSize / 2), 1);
                endPage = startPage + calcedMaxSize - 1;

                // Adjust if limit is exceeded
                if (endPage > totalPages) {
                    endPage = totalPages;
                    startPage = endPage - calcedMaxSize + 1;
                }
            } else {
                // Visible pages are paginated with maxSize
                startPage = ((Math.ceil(currentPage / calcedMaxSize) - 1) * calcedMaxSize) + 1;

                // Adjust last page if limit is exceeded
                endPage = Math.min(startPage + calcedMaxSize - 1, totalPages);
            }
        }

        // Add page number links
        for (var num = startPage; num <= endPage; num++) {
            var page = this.makePage(num, num.toString(), num === currentPage);
            pages.push(page);
        }

        // Add links to move between page sets
        if (isMaxSized && !this.rotate) {
            if (startPage > 1) {
                var previousPageSet = this.makePage(startPage - 1, '...', false);
                pages.unshift(previousPageSet);
                if (this.adjacents > 0) {
                    if (totalPages >= this.options.config.maxSize + (this.adjacents * 2)) {
                        pages.unshift(this.makePage(2, '2', false));
                        pages.unshift(this.makePage(1, '1', false));
                    }
                }
            }

            if (endPage < totalPages) {
                var nextPageSet = this.makePage(endPage + 1, '...', false);
                var addedNextPageSet = false;
                if (this.adjacents > 0) {
                    if (totalPages - this.adjacents > currentPage) { // && currentPage > adjacents) {
                        var removedLast = false;
                        addedNextPageSet = true;
                        if (pages && pages.length > 1 && pages[pages.length - 1].number == totalPages - 1) {
                            pages.splice(pages.length - 1, 1);
                            removedLast = true;
                        }
                        pages.push(nextPageSet);
                        if (removedLast || pages[pages.length - 1].number < totalPages - 2 || pages[pages.length - 2].number < totalPages - 2) {
                            pages.push(this.makePage(totalPages - 1, (totalPages - 1).toString(), false));
                        }

                        pages.push(this.makePage(totalPages, (totalPages).toString(), false));
                    }
                }

                if (!addedNextPageSet) {
                    pages.push(nextPageSet);
                }
            }
        }

        return pages;
    }

    ngOnInit() {
        this.options.records.subscribe(res => {
            this.pages = this.getPages(this.options.config.pageNumber, this.calculateTotalPages());
            this.changeRef.markForCheck();
        });
    }
}
