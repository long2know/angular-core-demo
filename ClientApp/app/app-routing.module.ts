import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Route1Component } from './components/route1/route1.component';
import { Route2Component } from './components/route2/route2.component';
import { Route3Component } from './components/route3/route3.component';
import { Route4Component } from './components/route4/route4.component';
import { NavigationService } from './services/navigation.service';

//const appRoutes: Routes = [
//    { path: '', component: Route1Component, data: { name: 'Route1' }, canDeactivate: [NavigationService] },
//    { path: 'route2', component: Route2Component, data: { name: 'Route2' }, canDeactivate: [NavigationService] },
//    { path: 'route3', component: Route3Component, data: { name: 'Route3' }, canDeactivate: [NavigationService] },
//    { path: 'route4', component: Route4Component, data: { name: 'Route4' }, canDeactivate: [NavigationService] }
//];

//export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', component: Route1Component, data: { name: 'Route1' }, canDeactivate: [NavigationService] },
            { path: 'route2', component: Route2Component, data: { name: 'Route2' }, canDeactivate: [NavigationService] },
            { path: 'route3', component: Route3Component, data: { name: 'Route3' }, canDeactivate: [NavigationService] },
            { path: 'route4', component: Route4Component, data: { name: 'Route4' }, canDeactivate: [NavigationService] }
            //{ path: "**", component: NotFoundComponent, data: { title: "Page Not Found" } },
        ])
    ],
    exports: [
        RouterModule
    ],
    providers: [
        NavigationService
    ]
})
export class AppRoutingModule { }