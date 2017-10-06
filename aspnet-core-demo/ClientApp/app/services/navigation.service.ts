import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
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
            .map((res) => { console.log("Mapped: " + res); return res; })
            .flatMap((res) => {
                // Inverse logic - false means deactivate of route is not allowed (hasChanges is true) 
                if (res === false) {
                    console.log("Showing confirm dialog.");
                    var modalPromise = this.dialogService.confirm();
                    var newObservable = Observable.fromPromise(modalPromise);
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
                    return Observable.of(res);
                }
            })
            .catch(error => Observable.of(false));
    }
}
