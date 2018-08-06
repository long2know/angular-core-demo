import { ModuleWithProviders, NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { Route1Component } from './components/route1/route1.component';
import { Route2Component } from './components/route2/route2.component';
import { Route3Component } from './components/route3/route3.component';
import { Route4Component } from './components/route4/route4.component';
import { ConfigService, NavigationService } from './services';

var appRoutes: Routes = [
    { path: '', component: Route1Component, data: { name: 'Route1', title: 'Custom Table', roles: [] }, canDeactivate: [NavigationService] },
    { path: 'route2', component: Route2Component, data: { name: 'Route2', title: 'Tristate Checkbox', roles: [] }, canDeactivate: [NavigationService] },
    { path: 'route3', component: Route3Component, data: { name: 'Route3', title: 'Multiselect Dropdown', roles: [] }, canDeactivate: [NavigationService] },
    { path: 'route4', component: Route4Component, data: { name: 'Route4', title: 'Loading Indicator', roles: [] }, canDeactivate: [NavigationService] }
];

@NgModule({
    imports: [RouterModule.forRoot([])],
    exports: [RouterModule],
    providers: [
        NavigationService, ConfigService,
        { provide: APP_INITIALIZER, useFactory: configServiceFactory, deps: [Injector, ConfigService], multi: true },
    ]
})

export class AppRoutingModule {
    constructor(private config: ConfigService) { }
}


export function configServiceFactory(injector: Injector, configService: ConfigService): Function {
    return () => {
        console.log('Getting config in routing module');
        return configService
            .loadConfig()
            .then(res => {
                var filteredRoutes = appRoutes.filter(item => {
                    if (!item.data.roles || item.data.roles.length === 0) {
                        return true;
                    }

                    // Intersect the arrays ...
                    return item.data.roles.filter(role => {
                        return configService.configData.roles.includes(role);
                    }).length > 0;
                });

                var router: Router = injector.get(Router);

                router.resetConfig(filteredRoutes);
            });
    }
}