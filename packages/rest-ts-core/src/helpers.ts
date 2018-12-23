/**
 * @module rest-ts-core
 */

 import { EndpointDefinition } from './base';

export function getPathWithParams(def: EndpointDefinition): string {
    let pathBuilder = def.path[0];
    if (isNotUndefined(def.params)) {
        for (let i = 0 ; i < def.params.length ; i++) {
            pathBuilder += ':' + def.params[i] + def.path[i+1];
        }
    }
    return pathBuilder;
}

export function makePathWithParams<T extends EndpointDefinition>(def: T, params: {[key: string]: string} | undefined): string {
    let pathBuilder = def.path[0];
    if (isNotUndefined(def.params) && isNotUndefined(params)) {
        for (let i = 0 ; i < def.params.length ; i++) {
            pathBuilder += params[def.params[i]] + def.path[i+1];
        }
    }
    return pathBuilder;
}

type NotUndefined<T> = T extends undefined ? never : T;
function isNotUndefined<T>(x: T): x is NotUndefined<T> {
    return typeof x !== 'undefined';
}
