import { EndpointDefinition } from './base';

export function getPathWithParams(def: EndpointDefinition): string {
    let i = 1;
    return def.path[0] + trailingSlashIfNeeded(def.params) + Object.keys(def.params || {}).map((k) => `:${k}` + def.path[i++]).join('');
}

export function makePathWithParams<T extends EndpointDefinition>(def: T, params: {[key: string]: string} | undefined): string {
    if (isNotUndefined(def.params) && isNotUndefined(params) ) {
        let i = 1;
        return def.path[0] + trailingSlashIfNeeded(def.params) + def.params.map((p) => params[p] + def.path[i++]).join('');
    }
    return def.path[0];
}

function trailingSlashIfNeeded(params?: string[]) {
    if (params != null && params.length > 0) {
        return '/';
    }
    return '';
}

type NotUndefined<T> = T extends undefined ? never : T;
function isNotUndefined<T>(x: T): x is NotUndefined<T> {
    return typeof x !== 'undefined';
}
