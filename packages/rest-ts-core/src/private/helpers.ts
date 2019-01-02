
import { EndpointDefinition } from '../types';

/**
 * Creates a string representing the generic path for the given endpoint.
 * 
 * Path parameters are prefixed with a colon ':'.
 * 
 * For instance, for an endpoint defined with: "GET `/pets/${type}/${name}`", 
 * this method returns "`/pets/:type/:name`".
 * 
 * @param def The endpoint definition whose path to get
 */
export function buildGenericPathname(def: EndpointDefinition): string {
    let pathBuilder = def.path[0];
    if (isNotUndefined(def.params)) {
        for (let i = 0 ; i < def.params.length ; i++) {
            pathBuilder += ':' + def.params[i] + def.path[i+1];
        }
    }
    return pathBuilder;
}

/**
 * Builds the pathname given an endpoint definition and some path parameters.
 * 
 * For instance, `buildPathnameFromParams(GET '/pets/${type}/${name}', {type: "cat", name: "linus"})`
 * returns: "/pets/cat/linus".
 * 
 * @param def The definition whose pathname to build
 * @param params The path parameters to inject
 */
export function buildPathnameFromParams<T extends EndpointDefinition>(def: T, params: {[key: string]: string} | undefined): string {
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
