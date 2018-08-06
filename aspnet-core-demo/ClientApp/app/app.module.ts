import { Component, NgModule, ErrorHandler, APP_INITIALIZER, PLATFORM_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import { APP_BASE_HREF, DOCUMENT, DatePipe, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppErrorHandler } from './app-error.handler';
import { AppComponent, Route1Component, Route2Component, Route3Component, Route4Component } from './components';
import { ApiService, ConfigService, NavigationService, DialogService, DialogComponent, NotificationService, DataService, LoremIpsumService, IdleTimeoutService, SpinService, SpinInterceptor, CustomerHeadersInterceptor } from './services';
import { EqualPipe, GroupByPipe } from './pipes';
import { CustomTable, CustomTableOptions, CustomTableConfig, CustomTableColumnDefinition, Multiselect, Filter, CustomFilterPipe, FilterPipe, Pager, Tristate, FilterBox, FilterBoxPipe } from './components';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestOptions, XHRBackend } from '@angular/http';
//import { ToastyModule } from 'ng2-toasty';

import 'jquery';
import 'bootstrap';

@NgModule({
    imports: [BrowserModule, FormsModule, ReactiveFormsModule, JsonpModule, HttpClientModule, NgbModule.forRoot(), AppRoutingModule], // ToastyModule.forRoot()],
    declarations: [AppComponent, Route1Component, Route2Component, Route3Component, Route4Component,
        DialogComponent, Multiselect, Tristate, CustomTable, Pager, Filter, FilterBox, CustomFilterPipe, FilterPipe, FilterBoxPipe, EqualPipe, GroupByPipe],
    providers: [
        EqualPipe, DatePipe,
        { provide: APP_BASE_HREF, useValue: getBasePath() },
        { provide: 'BASE_URL', useFactory: getBaseUrl },
        { provide: ErrorHandler, useClass: AppErrorHandler },
        { provide: HTTP_INTERCEPTORS, useClass: SpinInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: CustomerHeadersInterceptor, multi: true },
        { provide: APP_INITIALIZER, useFactory: configServiceFactory, deps: [ConfigService], multi: true },
        { provide: DOCUMENT, useFactory: getDocument },
        { provide: 'LOCALSTORAGE', useFactory: getLocalStorage },
        NavigationService, NotificationService, DialogService, ApiService, ConfigService, DataService, LoremIpsumService, IdleTimeoutService, SpinService],
    entryComponents: [DialogComponent, Route1Component, Route2Component, Route3Component, Route4Component],
    bootstrap: [AppComponent],
})

export class AppModule {
}

//export function httpFactory(backend: XHRBackend, options: RequestOptions, spinSvc: SpinService) {
//    return new HttpService(backend, options, spinSvc);
//}

export function getDocument() {
    return (typeof window !== "undefined") ? document : null;
}

export function getLocalStorage() {
    return (typeof window !== "undefined") ? window.localStorage : null;
}

export function getBaseUrl() {
    var base = document.getElementsByTagName('base')[0].href;
    console.log('BaseUrl: ' + base);
    return base;
}

export function getBasePath() {
    var base = document.getElementsByTagName('base')[0].getAttribute("href");
    console.log('BasePath: ' + base);
    return base;
}

export function configServiceFactory(configService: ConfigService): Function {
    return () => { return configService.loadConfig(); }
}