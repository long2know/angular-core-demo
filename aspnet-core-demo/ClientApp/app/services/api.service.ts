import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Injectable()
export class ApiService {
    constructor(private http: HttpClient) {
    }

    getUrl(url: string, search?: any): Observable<any> {
        console.log("In API Service.. making arbitrary call.");
        //var req = new HttpRequest('GET', url, '', {
        //    responseType: 'text',
        //    headers: new HttpHeaders()
        //});

        // Allow passing in HttpParams
        let httpParams = new HttpParams();
        for (let key in search) {
            httpParams = httpParams.append(key, search[key]);
        }

        return this.http
            .get(url, { params: httpParams })
            .pipe(map((res: Response) => {
                console.log('Request complete');
                return res;
            }));

        //return this.http
        //    .request(req)
        //    .subscribe(event => {
        //        console.log('API Request done.');
        //        //// Via this API, you get access to the raw event stream.
        //        //// Look for upload progress events.
        //        //if (event.type === HttpEventType.UploadProgress) {
        //        //    // This is an upload progress event. Compute and show the % done:
        //        //    const percentDone = Math.round(100 * event.loaded / event.total);
        //        //    console.log(`File is ${percentDone}% uploaded.`);
        //        //} else if (event instanceof HttpResponse) {
        //        //    console.log('File is completely uploaded!');
        //        //}
        //    })
        //    .map((res: Response) => {
        //        //console.log(res);
        //        return res.json();
        //    });
    }

    put(url: string, body: any, search?: any): Observable<any> {
        console.log("In API Service.. making put call.");
        let headers: HttpHeaders = new HttpHeaders();

        // Allow passing in HttpParams
        let httpParams = new HttpParams();
        for (let key in search) {
            if (typeof (search[key]) !== 'undefined') {
                httpParams = httpParams.append(key, search[key]);
            }
        }

        return this.http
            .put(url, body, { params: httpParams })
            .pipe(map((res: Response) => {
                console.log('Request complete');
                return res;
            }));
    }
}
