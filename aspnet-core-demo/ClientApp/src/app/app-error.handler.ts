import { Injectable, Injector, Inject, ErrorHandler, ChangeDetectorRef, NgZone } from "@angular/core";
import { DialogService, NotificationService } from './services/index';
import { Observable, from } from 'rxjs';
import { NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
//import { AlertService, MessageSeverity } from './services/alert.service';

@Injectable()
export class AppErrorHandler extends ErrorHandler {
    //private alertService: AlertService;
    private notificationService: NotificationService;
    private dialogService: DialogService;

    constructor(private injector: Injector) {
        super();
    }

    handleError(error: any) {
        //if (this.alertService == null) {
        //    this.alertService = this.injector.get(AlertService);
        //}
        try {
            if (this.notificationService == null) {
                this.notificationService = this.injector.get(NotificationService);
            }

            if (this.dialogService == null) {
                this.dialogService = this.injector.get(DialogService);
            }


            this.notificationService.warning("An unresolved error has occured. Please reload the page to correct this error");
            //this.alertService.showStickyMessage("Fatal Error!", "An unresolved error has occured. Please reload the page to correct this error", MessageSeverity.warn);
            //this.alertService.showStickyMessage("Unhandled Error", error.message || error, MessageSeverity.error, error);

            // For some reason, unless I run the zone, the dialog doesn't get display unless a DOM event is triggered..
            var zone: NgZone = this.injector.get(NgZone);
            zone.run(() => {
                console.log('Running zone..');

                console.log("Showing confirm dialog.");
                let options: NgbModalOptions = { size: 'lg' };
                var modalPromise: Promise<any> = this.dialogService.open("Fatal Error!",
                    "An unresolved error has occured. Do you want to reload the page to correct this?<br/><br/>Error: " + error.message, true, "Yes", "No", options);
                var newObservable: Observable<any> = from(modalPromise);
                newObservable.subscribe(
                    (res) => {
                        if (res === true) {
                            window.location.reload(true);
                            super.handleError(error);
                        } else {
                            super.handleError(error);
                        }
                    },
                    (reason) => {
                        console.log("Dismissed " + reason);
                        super.handleError(error);
                    }
                );

                super.handleError(error);
            });
        }
        catch (e) {
            // if, for some reason, we can't display the dialog, fall back to plain confirm
            if (confirm("Fatal Error!\nAn unresolved error has occured. Do you want to reload the page to correct this?\n\nError: " + error.message))
                window.location.reload(true);
            super.handleError(error);
        }
    }
}