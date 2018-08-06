import { Component, ViewEncapsulation, Input, Injectable, ApplicationRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Pipe, PipeTransform, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd, Route } from '@angular/router';
import { DialogService, DialogComponent, NotificationService } from '../services';
import { Multiselect } from '.';

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
        private route: ActivatedRoute, public router: Router, private dialogService: DialogService,
        private notificationService: NotificationService) {
    }

    toggleMenu() {
        this.isMenuExpanded = !this.isMenuExpanded;
    }

    open() {
        //this.dialogService.open();
    }

    ngOnInit() {
        console.log('Configured routes: ', this.router.config);
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(event => {
                let currentRoute = this.route.root;
                while (currentRoute.children[0] !== undefined) {
                    currentRoute = currentRoute.children[0];
                }

                // Do we have a match?
                var filteredRoutes = this.router.config.filter(route => {
                    if (currentRoute.snapshot.routeConfig === null) {
                        return false;
                    }
                    return route.path === currentRoute.snapshot.routeConfig.path;
                });

                if (filteredRoutes.length === 0) {
                    console.log("Navigated to AppComponent - route is probably bad.  Navigating to first available route..");
                    var route: Route = this.router.config[0];
                    this.router.navigate(['/' + route.path]);
                }

                //this.notificationService.success("Hey, this is a toast");
            });
    }
}
