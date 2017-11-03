import { Injectable } from '@angular/core';
import { ToastyService, ToastyConfig, ToastyComponent, ToastOptions, ToastData } from 'ng2-toasty';
import { Subject, Observable, Subscription } from 'rxjs/Rx';

@Injectable()
export class NotificationService {
    constructor(private toastyService: ToastyService) { }

    success(message: string) {
        this.displayToast(message, 'success');
    };

    error(message) {
        this.displayToast(message, 'error');
    };

    info(message) {
        this.displayToast(message, 'info');
    };

    warning(message) {
        this.displayToast(message, 'warning');
    };

    private displayToast(message: string, type: string) {
        let interval = 1000;
        let timeout = 5000;
        let seconds = timeout / 1000;
        let subscription: Subscription;

        let toastOptions: ToastOptions = {
            title: '',
            msg: message,
            showClose: true,
            timeout: timeout,
            theme: 'bootstrap',
            onAdd: (toast: ToastData) => {
                console.log('Toast ' + toast.id + ' has been added!');
                // Run the timer with 1 second iterval
                let observable = Observable.interval(interval).take(seconds);
                // Start listen seconds beat
                subscription = observable.subscribe((count: number) => {
                    //// Update title of toast
                    //toast.title = this.getTitle(seconds - count - 1);
                    //// Update message of toast
                    //toast.msg = this.getMessage(seconds - count - 1);
                });

            },
            onRemove: function (toast: ToastData) {
                console.log('Toast ' + toast.id + ' has been removed!');
                // Stop listenning
                subscription.unsubscribe();
            }
        };

        switch (type) {
            case 'default': this.toastyService.default(toastOptions); break;
            case 'info': this.toastyService.info(toastOptions); break;
            case 'success': this.toastyService.success(toastOptions); break;
            case 'wait': this.toastyService.wait(toastOptions); break;
            case 'error': this.toastyService.error(toastOptions); break;
            case 'warning': this.toastyService.warning(toastOptions); break;
        }
    }
}