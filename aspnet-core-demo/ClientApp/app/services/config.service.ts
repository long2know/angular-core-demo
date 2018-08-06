import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { HttpClient, HttpRequest, HttpHeaders, HttpEventType, HttpResponse } from "@angular/common/http";
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ConfigService {
    private _configData: any = null;
    private _serviceId: string = 'configsvc-' + Math.floor(Math.random() * 10000);
    private _promise: Promise<any>;
    private _promiseDone: boolean = false;

    constructor(private http: HttpClient) { }

    loadConfig(forceReload: boolean = false): Promise<any> {
        var url: string = "/api/config";

        if (forceReload && this._promise == null) {
            this._configData = null;
        }

        if (this._promiseDone) {
            console.log("In Config Service " + this._serviceId + ". Promise is already complete.");
            return Promise.resolve();
        }

        if (this._promise != null) {
            console.log("In Config Service " + this._serviceId + ". Promise exists.  Returning it.");
            return this._promise;
        }

        console.log("In Config Service " + this._serviceId + ". Loading config data.");
        this._promise = this.http
            .get(url, { headers: new HttpHeaders() })
            .pipe(map((res: Response) => { return res; }))
            .toPromise()
            .then((data: any) => { this._configData = data; this._promiseDone = true; })
            .catch((err: any) => { this._promiseDone = true; return Promise.resolve(); });
        return this._promise;
    }

    get configData(): any {
        return this._configData;
    }
}
