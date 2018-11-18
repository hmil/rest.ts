import { AEndpointBuilder, HttpMethod, QueryParams, ApiDefinition } from './base';
import { RemoveKey } from '.';

// Utilities to help build interface definitions
interface PathWithParams<A> {
    base: string;
    params: A;
}

export class EndpointBuilder<T> implements AEndpointBuilder<T> {

    constructor(public readonly def: Readonly<T>) { }

    public method<U extends HttpMethod>(method: U): EndpointBuilder<RemoveKey<T, 'method'> & { method: U }> {
        return new EndpointBuilder<T & { method: U }>(Object.assign({}, this.def, { method }));
    }
    
    public path<U extends PathWithParams<string[]>>(path: U): EndpointBuilder<RemoveKey<T, 'path'> & { path: U }>  {
        return new EndpointBuilder<T & { path: U }>(Object.assign({}, this.def, { path }));
    }

    public response<U>(response: U): EndpointBuilder<RemoveKey<T, 'response'> & { response: U }>  {
        return new EndpointBuilder<T & { response: U }>(Object.assign({}, this.def, { response }));
    }

    public body<U>(body: U): EndpointBuilder<RemoveKey<T, 'body'> & { body: U }> {
        return new EndpointBuilder<T & { body: U }>(Object.assign({}, this.def, { body }));
    }

    public query<U extends QueryParams>(query: U): EndpointBuilder<RemoveKey<T, 'query'> & { query: U }> {
        return new EndpointBuilder<T & { query: U }>(Object.assign({}, this.def, { query }));
    }
}

function endpoint(pathOrStaticParts: TemplateStringsArray | string, ...params: string[]) {
    if (typeof pathOrStaticParts === 'string') {
        return new EndpointBuilder({
            path: [ pathOrStaticParts ],
            params: [],
            response: undefined
        });
    }

    return new EndpointBuilder({
        path: pathOrStaticParts.slice(),
        params: params || [],
        response: undefined
    });
}


export interface InitialEndpointDefinition<Params, METHOD extends HttpMethod | undefined> {
    path: string[];
    params: Params;
    method: METHOD;
    response: undefined;
}

export interface EmptyInitialEndpointDefinition<METHOD extends HttpMethod | undefined> {
    path: string[];
    method: METHOD;
    response: undefined;
}

export function GET(path: string | TemplateStringsArray): EndpointBuilder<EmptyInitialEndpointDefinition<'GET'>>;
export function GET<A extends string>(strings: TemplateStringsArray, a: A): EndpointBuilder<InitialEndpointDefinition<[A], 'GET'>>;
export function GET<A extends string, B extends string>(strings: TemplateStringsArray, a: A, b: B): EndpointBuilder<InitialEndpointDefinition<[A, B], 'GET'>>;
export function GET<A extends string, B extends string, C extends string>(strings: TemplateStringsArray, a: A, b: B, c: C): EndpointBuilder<InitialEndpointDefinition<[A, B, C], 'GET'>>;
export function GET<A extends string, B extends string, C extends string, D extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D], 'GET'>>;
export function GET<A extends string, B extends string, C extends string, D extends string, E extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E], 'GET'>>;
export function GET<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F], 'GET'>>;
export function GET<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G], 'GET'>>;
export function GET<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H], 'GET'>>;
export function GET(pathOrStaticParts: TemplateStringsArray | string, ...params: string[]): EndpointBuilder<InitialEndpointDefinition<string[], 'GET'>> {
    return endpoint(pathOrStaticParts, ...params).method('GET');
}

export function PUT(path: string | TemplateStringsArray): EndpointBuilder<EmptyInitialEndpointDefinition<'PUT'>>;
export function PUT<A extends string>(strings: TemplateStringsArray, a: A): EndpointBuilder<InitialEndpointDefinition<[A], 'PUT'>>;
export function PUT<A extends string, B extends string>(strings: TemplateStringsArray, a: A, b: B): EndpointBuilder<InitialEndpointDefinition<[A, B], 'PUT'>>;
export function PUT<A extends string, B extends string, C extends string>(strings: TemplateStringsArray, a: A, b: B, c: C): EndpointBuilder<InitialEndpointDefinition<[A, B, C], 'PUT'>>;
export function PUT<A extends string, B extends string, C extends string, D extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D], 'PUT'>>;
export function PUT<A extends string, B extends string, C extends string, D extends string, E extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E], 'PUT'>>;
export function PUT<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F], 'PUT'>>;
export function PUT<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G], 'PUT'>>;
export function PUT<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H], 'PUT'>>;
export function PUT(pathOrStaticParts: TemplateStringsArray | string, ...params: string[]): EndpointBuilder<InitialEndpointDefinition<string[], 'PUT'>> {
    return endpoint(pathOrStaticParts, ...params).method('PUT');
}

export function POST(path: string | TemplateStringsArray): EndpointBuilder<EmptyInitialEndpointDefinition<'POST'>>;
export function POST<A extends string>(strings: TemplateStringsArray, a: A): EndpointBuilder<InitialEndpointDefinition<[A], 'POST'>>;
export function POST<A extends string, B extends string>(strings: TemplateStringsArray, a: A, b: B): EndpointBuilder<InitialEndpointDefinition<[A, B], 'POST'>>;
export function POST<A extends string, B extends string, C extends string>(strings: TemplateStringsArray, a: A, b: B, c: C): EndpointBuilder<InitialEndpointDefinition<[A, B, C], 'POST'>>;
export function POST<A extends string, B extends string, C extends string, D extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D], 'POST'>>;
export function POST<A extends string, B extends string, C extends string, D extends string, E extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E], 'POST'>>;
export function POST<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F], 'POST'>>;
export function POST<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G], 'POST'>>;
export function POST<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H], 'POST'>>;
export function POST(pathOrStaticParts: TemplateStringsArray | string, ...params: string[]): EndpointBuilder<InitialEndpointDefinition<string[], 'POST'>> {
    return endpoint(pathOrStaticParts, ...params).method('POST');
}

export function DELETE(path: string): EndpointBuilder<EmptyInitialEndpointDefinition<'DELETE'>>;
export function DELETE<A extends string>(strings: TemplateStringsArray, a: A): EndpointBuilder<InitialEndpointDefinition<[A], 'DELETE'>>;
export function DELETE<A extends string, B extends string>(strings: TemplateStringsArray, a: A, b: B): EndpointBuilder<InitialEndpointDefinition<[A, B], 'DELETE'>>;
export function DELETE<A extends string, B extends string, C extends string>(strings: TemplateStringsArray, a: A, b: B, c: C): EndpointBuilder<InitialEndpointDefinition<[A, B, C], 'DELETE'>>;
export function DELETE<A extends string, B extends string, C extends string, D extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D], 'DELETE'>>;
export function DELETE<A extends string, B extends string, C extends string, D extends string, E extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E], 'DELETE'>>;
export function DELETE<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F], 'DELETE'>>;
export function DELETE<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G], 'DELETE'>>;
export function DELETE<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H], 'DELETE'>>;
export function DELETE(pathOrStaticParts: TemplateStringsArray | string, ...params: string[]): EndpointBuilder<InitialEndpointDefinition<string[], 'DELETE'>> {
    return endpoint(pathOrStaticParts, ...params).method('DELETE');
}


export function PATCH(path: string): EndpointBuilder<EmptyInitialEndpointDefinition<'PATCH'>>;
export function PATCH<A extends string>(strings: TemplateStringsArray, a: A): EndpointBuilder<InitialEndpointDefinition<[A], 'PATCH'>>;
export function PATCH<A extends string, B extends string>(strings: TemplateStringsArray, a: A, b: B): EndpointBuilder<InitialEndpointDefinition<[A, B], 'PATCH'>>;
export function PATCH<A extends string, B extends string, C extends string>(strings: TemplateStringsArray, a: A, b: B, c: C): EndpointBuilder<InitialEndpointDefinition<[A, B, C], 'PATCH'>>;
export function PATCH<A extends string, B extends string, C extends string, D extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D], 'PATCH'>>;
export function PATCH<A extends string, B extends string, C extends string, D extends string, E extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E], 'PATCH'>>;
export function PATCH<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F], 'PATCH'>>;
export function PATCH<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G], 'PATCH'>>;
export function PATCH<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H], 'PATCH'>>;
export function PATCH(pathOrStaticParts: TemplateStringsArray | string, ...params: string[]): EndpointBuilder<InitialEndpointDefinition<string[], 'PATCH'>> {
    return endpoint(pathOrStaticParts, ...params).method('PATCH');
}

export const defineAPI = <T extends ApiDefinition>(api: T) => api;
