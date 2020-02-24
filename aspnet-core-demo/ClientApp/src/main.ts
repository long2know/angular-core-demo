import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.log(err));

// Removing for now since it causes strict issues
// See these links for details:
// https://github.com/angular/angular/issues/34970
// https://github.com/angular/universal/issues/1390
// https://jasontaylor.dev/asp-net-core-angular-9-upgrade/
//export { renderModule, renderModuleFactory } from '@angular/platform-server';
