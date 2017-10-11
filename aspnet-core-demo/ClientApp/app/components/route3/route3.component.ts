import { Component, Input, Injectable, ApplicationRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Multiselect } from '../multiselect/multiselect.component';
import { Observable } from 'rxjs/Rx';
import { Pipe, PipeTransform, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { EqualPipe } from '../../pipes/equal-pipe';
import { LoremIpsumService } from "../../services/loremIpsum.service";

@Component({
    templateUrl: 'route3.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class Route3Component implements OnInit {
    public hasChanges: Boolean = true;
    public items: Observable<Array<any>>;
    public selectedItems: Observable<Array<any>>;
    public _selectedItems: Array<any> = [];
    public watchedItems: Array<any>;
    private _items: Array<any>;

    constructor(private changeRef: ChangeDetectorRef, private appRef: ApplicationRef, private lipsumSvc: LoremIpsumService) {
        this._items = [];
        this.items = Observable.of(this._items);
        this.items.subscribe(res => { console.log("Items changed"); this.watchedItems = res; });
    }

    canDeactivate() {
        console.log("Detecting changes. Has Changes: " + this.hasChanges);
        return Observable.of(!this.hasChanges);
    }

    createItems() {
        this._items.length = 0;
        var max: number = 20;
        var min: number = 10;
        var numItems: number = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log("Adding " + numItems.toString() + " items");
        max = 6;
        min = 3;
        var i: number;
        for (i = 0; i < numItems; i++) {
            var numWords: number = Math.floor(Math.random() * (max - min + 1)) + min;
            var label: string = this.lipsumSvc.generate(numWords);
            this._items.push({ label: label, value: i.toString() });
            console.log(label);
        }

        // Randomly choose a few items
        this.randomSelect();
    }

    randomSelect() {
        var numItems: number = this.getRandomInt(0, this._items.length) + 1;
        var min: number = 0;
        var max: number = this._items.length - 1;
        var toSelectIndexes: Array<number> = [];
        for (var j: number = 0; j < this.getRandomInt(1, numItems); j++) {
            var randIndex: number = this.getRandomInt(min, max);
            var arrIndex = toSelectIndexes.indexOf(randIndex);
            if (arrIndex == -1) {
                toSelectIndexes.push(randIndex);
                var item: any = this._items[randIndex];
                item.checked = true;
                this._selectedItems.push(this._items[randIndex]);
            }
        }
    }

    getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    onChange(newValue) {
        console.log('received change event');
    }


    ngOnInit() {
        this.createItems();
        let timer = Observable.timer(20000, 20000);
        timer.subscribe(t => {
            //this.createItems();
        });
    }
}

