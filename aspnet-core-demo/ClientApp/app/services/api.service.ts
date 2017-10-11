import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiService {
    constructor(private http: Http) {
    }

    getUrl(url: string) {
        console.log("In API Service.. making arbitrary call.");
        var headers = new Headers();
        var requestOptions = new RequestOptions({
            method: RequestMethod.Get,
            url: url,
            headers: headers,
            body: ''
        });

        return this.http
            .request(new Request(requestOptions))
            .map((res: Response) => {
                console.log(res);
                return "done";
            });
    }
}
