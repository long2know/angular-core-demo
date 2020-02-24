import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import * as toastr from 'toastr';

@Injectable()
export class NotificationService {
    private toastr: any;
    private toastrOptions: any;

    private defaultSuccess: string = "Success!";
    private defaultError: string = "Error!";
    private defaultInfo: string = "Info";

    constructor() {
        this.toastr = <any>toastr;

        // Set defaults
        this.toastrOptions = {
            positionClass: 'toast-bottom-right'
        };

        this.toastr.options = this.toastrOptions;
    }

    success(message?: string) {
        this.displayToast(message || this.defaultSuccess, 'success');
    };

    error(message?: string) {
        this.displayToast(message || this.defaultError, 'error');
    };

    info(message?: string) {
        this.displayToast(message || this.defaultInfo, 'info');
    };

    warning(message) {
        this.displayToast(message, 'warning');
    };

    private displayToast(message: string, type: string) {
        switch (type) {
            case 'default': this.toastr.default(message); break;
            case 'info': this.toastr.info(message); break;
            case 'success': this.toastr.success(message); break;
            case 'wait': this.toastr.wait(message); break;
            case 'error': this.toastr.error(message); break;
            case 'warning': this.toastr.warning(message); break;
        }
    }
}