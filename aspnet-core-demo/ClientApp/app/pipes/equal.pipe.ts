import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'equal',
    pure: true
})

export class EqualPipe implements PipeTransform {
    transform(items: any, filter: any): any {
        if (filter && Array.isArray(items)) {
            let filterKeys = Object.keys(filter);
            return items.filter(item =>
                // Compare the filter, but if the key doesn't exist, return true also.
                filterKeys.reduce((memo, keyName) => {
                    if (keyName.indexOf('.') === -1) {
                        console.log("Comparing " + item[keyName] + " to " + filter[keyName]);
                        return item[keyName] === filter[keyName] || item[keyName] === undefined;
                    }
                    else {
                        var value = keyName.split('.').reduce((prev: any, curr: string) => prev[curr], item);
                        console.log("Comparing " + value + " to " + filter[keyName]);
                        return value === filter[keyName] || value === undefined;
                    }
                }, true)
            );
        } else {
            return items;
        }
    }
}