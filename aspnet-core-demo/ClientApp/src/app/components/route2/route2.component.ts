import { Component, Input, Injectable, ApplicationRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Pipe, PipeTransform, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription, of } from 'rxjs';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Multiselect } from '../';
import { ApiService, LoremIpsumService } from '../../services';

@Component({
  templateUrl: 'route2.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Route2Component implements OnInit {
  public hasChanges: Boolean = false;
  public _items: Array<any>;
  public items: Observable<Array<any>>;
  public routeParam: any;
  private subscription: Subscription;

  constructor(private changeRef: ChangeDetectorRef, private appRef: ApplicationRef, private route: ActivatedRoute,
    private apiService: ApiService, private lipsumSvc: LoremIpsumService) {
    this._items = [];
    this.items = of(this._items);
    this.items.subscribe(res => {
      console.log("Route2 subscription triggered.");
    });
  }

  canDeactivate() {
    console.log("Detecting changes. Has Changes: " + this.hasChanges);
    return of(!this.hasChanges);
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

  //ngOnInit() {
  //    
  //}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.routeParam = params['id']; // (+) converts string 'id' to a number
    });

    this.createItems();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
