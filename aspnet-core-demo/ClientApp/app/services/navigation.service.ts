import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, from } from 'rxjs';
import { tap, delay, map, flatMap, catchError } from 'rxjs/operators';
import { DialogService } from './dialog.service';

export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class NavigationService implements CanDeactivate<CanComponentDeactivate>, CanActivate {
    constructor(private dialogService: DialogService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    canDeactivate(component: CanComponentDeactivate) {
        if (!component.canDeactivate) {
            return new Promise<boolean>(resolve => { return resolve(true); });
        }

        var retValue = component.canDeactivate();

        if (retValue instanceof Observable) {
            console.log("We have an observable");
            return this.intercept(retValue);
        } else {
            console.log("We have a promise");
            return retValue;
        }
    }

    private intercept(observable: Observable<any>): Observable<any> {
        return observable
            .pipe(map((res) => { console.log("Mapped: " + res); return res; }))
            .pipe(flatMap((res) => {
                // Inverse logic - false means deactivate of route is not allowed (hasChanges is true) 
                if (res === false) {
                    console.log("Showing confirm dialog.");
                    var modalPromise = this.dialogService.confirm();
                    var newObservable = from(modalPromise);
                    newObservable.subscribe(
                        (res) => {
                            if (res === true) {
                                console.log("Navigation allowed.");
                            } else {
                                console.log("Navigation prevented.");
                            }
                        },
                        (reason) => {
                            console.log("Dismissed " + reason);
                        }
                    );
                    return newObservable;
                } else {
                    return of(res);
                }
            }),
            catchError(error => of(false)));
    }
}
