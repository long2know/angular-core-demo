import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, finalize, tap } from 'rxjs/operators';

@Injectable()
export class CustomerHeadersInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Timezone stuff
        var dst: Date = new Date(new Date().getFullYear(), 6, 1);
        var std: Date = new Date(new Date().getFullYear(), 1, 1);
        var dstOffset: string = dst.getTimezoneOffset().toString();
        var stdOffset: string = std.getTimezoneOffset().toString();
        var dstName: string = dst.toString().split('(')[1].slice(0, -1);
        var stdName: string = std.toString().split('(')[1].slice(0, -1);;

        // Clone the request to add headers (requests are immutable, yada yada)
        const clonedReq: HttpRequest<any> = req.clone({
            setHeaders: {
                'X-Requested-With': 'XMLHttpRequest',
                'tzoffset': new Date().getTimezoneOffset().toString(),
                'tzdst': dstOffset,
                'tzstd': stdOffset,
                'tzdstname': dstName,
                'tzname': stdName
            }
        });

        return next.handle(clonedReq).pipe(
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {

                }
            }),
            catchError(err => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        // Login expired, go to login
                        // Observable.throw(err);
                    }
                }

                console.log('Caught error', err);
                return Observable.throw(err);
            }),
            finalize(() => {

            })
        );
    }
}

