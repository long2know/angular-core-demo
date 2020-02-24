import { Component, Input, Injectable, ApplicationRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Pipe, PipeTransform, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ApiService, LoremIpsumService } from "../../services";

@Component({
  templateUrl: 'route4.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Route4Component implements OnInit {
  private _lipsum: any;
  public hasChanges: Boolean = false;

  constructor(private changeRef: ChangeDetectorRef, private appRef: ApplicationRef, private apiService: ApiService, private lipsumSvc: LoremIpsumService) {
  }

  canDeactivate() {
    console.log("Detecting changes. Has Changes: " + this.hasChanges);
    return of(!this.hasChanges);
  }

  makeCall() {
    this.apiService
      .getUrl("/api/employee?filterText=St")
      .subscribe();
  }

  ngOnInit() {
  }
}
