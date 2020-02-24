import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ConfigService } from "./index";

@Injectable()
export class IdleTimeoutService {
    private _configData: any;
    private _count: number = 0;
    private _serviceId: string = 'idleTimeoutSvc-' + Math.floor(Math.random() * 10000);
    private _timeoutMilliseconds: number = 0;
    private timerSubscription: Subscription;
    private _timer: Observable<number>;
    private resetOnTrigger: boolean = true;
    public timeoutExpired: Subject<number> = new Subject<number>();

    constructor(private configSvc: ConfigService) {
        this.timeoutExpired.subscribe(n => {
            console.log("timeoutExpired subject next.. " + n.toString())
        });

        //configSvc
        //    .loadConfig()
        //    .then(res => {
        //        this._timeoutMilliseconds = <number>this.configSvc.configData.authSettings.authTimeout;
        //        this.startTimer();
        //    });
    }

    private setSubscription() {
        this._timer = timer(this._timeoutMilliseconds);
        this.timerSubscription = this._timer.subscribe(n => {
            this.timerComplete(n);
        });
    }

    public startTimer() {
        if (this.timerSubscription) {
            this.stopTimer();
        }

        if (this._timeoutMilliseconds === 0) {
            this.configSvc
                .loadConfig()
                .then(res => {
                    let configVal: number = this.configSvc.configData && this.configSvc.configData.authSettings ? <number>this.configSvc.configData.authSettings.authTimeout : 20 * 60 * 1000;
                    this._timeoutMilliseconds = configVal ? configVal : 20 * 60 * 1000;
                    this.setSubscription();
                });
        }
        else {
            this.setSubscription();
        }
    }

    public stopTimer() {
        this.timerSubscription.unsubscribe();
    }

    public resetTimer() {
        this.startTimer();
    }

    private timerComplete(n: number) {
        this.timeoutExpired.next(++this._count);

        if (this.resetOnTrigger) {
            this.startTimer();
        }
    }
}
