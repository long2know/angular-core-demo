import { Component, ViewEncapsulation, Input, Injectable, ApplicationRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Multiselect } from './multiselect/multiselect.component';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/filter';
import { Pipe, PipeTransform, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DialogService, DialogComponent } from '../services/dialog.service';
import { NotificationService } from '../services/notification.service';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css', '../styles.css', '../themes.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    entryComponents: [DialogComponent],
    encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {
    private _lipsum: any;
    public isMenuExpanded: Boolean = false;

    constructor(private changeRef: ChangeDetectorRef, private appRef: ApplicationRef,
        private route: ActivatedRoute, private router: Router, private dialogService: DialogService,
        private notificationService: NotificationService) {
    }

    toggleMenu() {
        this.isMenuExpanded = !this.isMenuExpanded;
    }

    open() {
        //this.dialogService.open();
    }

    ngOnInit() {
        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe(event => {
                let currentRoute = this.route.root;
                while (currentRoute.children[0] !== undefined) {
                    currentRoute = currentRoute.children[0];
                }
                console.log(currentRoute.snapshot.data);

                this.notificationService.success("Hey, this is a toast");
            })
    }
}
