import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpRequest, HttpHeaders, HttpEventType, HttpResponse } from "@angular/common/http";

@Injectable()
export class ApiService {
    constructor(private http: HttpClient) {
    }

    getUrl(url: string) {
        console.log("In API Service.. making arbitrary call.");
        var req = new HttpRequest('GET', url, '', {
            responseType: 'text',
            headers: new HttpHeaders()
        });

        return this.http
            .request(req)
            .map((res: any) => {
                console.log(res);
                return "done";
            });
            //.subscribe(event => {
            //    console.log('API Request done.');
            //    //// Via this API, you get access to the raw event stream.
            //    //// Look for upload progress events.
            //    //if (event.type === HttpEventType.UploadProgress) {
            //    //    // This is an upload progress event. Compute and show the % done:
            //    //    const percentDone = Math.round(100 * event.loaded / event.total);
            //    //    console.log(`File is ${percentDone}% uploaded.`);
            //    //} else if (event instanceof HttpResponse) {
            //    //    console.log('File is completely uploaded!');
            //    //}
            //});
    }
}
