import { Component, Input, Injectable, ApplicationRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Rx';
import { Pipe, PipeTransform, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { Multiselect } from '../multiselect/multiselect.component';
import { ApiService } from '../../services/api.service';
import { LoremIpsumService } from "../../services/loremIpsum.service";

@Component({
    templateUrl: 'route2.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class Route2Component implements OnInit {
    public hasChanges: Boolean = true;
    public _items: Array<any>;
    public items: Observable<Array<any>>;

    constructor(private changeRef: ChangeDetectorRef, private appRef: ApplicationRef, private apiService: ApiService, private lipsumSvc: LoremIpsumService) {
        this._items = [];
        this.items = Observable.of(this._items);
        this.items.subscribe(res => {
            console.log("Route2 subscription triggered.");
        });
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
            this._items.push({ id: i, label: label, value: i.toString(), isSelected: true });
            console.log(label);
        }

        // Randomly choose a few items
        //this.randomSelect();
    }

    makeCall() {
        this.apiService
            .getUrl("index.html")
            .subscribe();
    }

    checkAll() {
        for (var i: number = 0; i < this._items.length; i++) {
            this._items[i].isSelected = true;
        }
    }

    uncheckAll() {
        for (var i: number = 0; i < this._items.length; i++) {
            this._items[i].isSelected = false;
        }
    }

    ngOnInit() {
        this.createItems();
    }
}
