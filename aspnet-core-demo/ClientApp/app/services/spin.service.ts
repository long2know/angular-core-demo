import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
declare var Spinner: any;

@Injectable()
export class SpinService {
    private modal_opts: any = {
        lines: 11, // The number of lines to draw
        length: 23, // The length of each line
        width: 8, // The line thickness
        radius: 40, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 9, // The rotation offset
        color: '#FFF', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 50, // Afterglow percentage
        shadow: true, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
    };

    private presets: any = {
        tiny: { lines: 8, length: 2, width: 2, radius: 3 },
        small: { lines: 8, length: 4, width: 3, radius: 5 },
        large: { lines: 10, length: 8, width: 4, radius: 8 }
    }

    constructor() {
    }

    public spin(selector: any, opts: any, color: any, bgColor: any) {
        var that = this;
        if (opts == "modal") opts = that.modal_opts;
        var $elements = $(selector);
        return $elements.each(function () {
            var $this = $(this),
                data = $this.data();

            if (data.spinner) {
                data.spinner.stop();
                delete data.spinner;
                if (opts == that.modal_opts) {
                    $("#spin_modal_overlay").remove();
                    return;
                }
            }
            if (opts !== false) {
                var spinElem = this;
                if (opts == that.modal_opts) {
                    var backgroundColor = 'background-color:' + (bgColor ? bgColor : 'rgba(0, 0, 0, 0.6)');
                    $('body').append('<div id="spin_modal_overlay" style=\"' + backgroundColor + ';width:100%; height:100%; position:fixed; top:0px; left:0px; z-index:' + (opts.zIndex - 1) + '"/>');
                    spinElem = $("#spin_modal_overlay")[0];
                }

                opts = $.extend({}, that.presets[opts] || opts, { color: color || $this.css('color') });
                data.spinner = new Spinner(opts).spin(spinElem);
            }
        })
    }
}


@Injectable()
export class SpinInterceptor implements HttpInterceptor {
    public pendingRequests: number = 0;
    public showLoading: Boolean = false;

    constructor(private spinSvc: SpinService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.pendingRequests++;
        this.turnOnModal();

        return next.handle(req)
            .do((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {

                }
            })
            .catch(err => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        // JWT expired, go to login
                        // Observable.throw(err);
                    }
                }

                console.log('Caught error', err);
                return Observable.throw(err);
            })
            .finally(() => {
                console.log("Finally.. delaying, though.")
                var timer = Observable.timer(1000);
                timer.subscribe(t => {
                    this.turnOffModal();
                });
            });
    }

    private turnOnModal() {
        if (!this.showLoading) {
            this.showLoading = true;
            this.spinSvc.spin("body", "modal", "#FFFFFF", "rgba(51, 51, 51, 0.1)");
            console.log("Turned on modal");
        }
        this.showLoading = true;
    }

    private turnOffModal() {
        this.pendingRequests--;
        if (this.pendingRequests <= 0) {
            if (this.showLoading) {
                this.spinSvc.spin("body", "modal", "#FFFFFF", "rgba(51, 51, 51, 0.1)");
            }
            this.showLoading = false;
        }
        console.log("Turned off modal");
    }
}

