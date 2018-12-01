import { AEndpointBuilder, HttpMethod, QueryParams, ApiDefinition, EndpointDefinition } from './base';
import { RemoveKey } from '.';

/**
 * Builder class to create endpoint definitions.
 * 
 * This class provides a high-level user friendly interface to create a typed definition of an API endpoint.
 * 
 * Endpoint definitions are usually grouped together in API definitions, which can be shared between producers
 * and consumers of the API to create a type-safe communication channel.
 * 
 * You will generally not need to create this class explicitly. Instead, use the helper methods [[GET]], [[PUT]],
 * [[PATCH]], [[POST]] or [[DELETE]] to create an instance of EndpointBuilder.
 */
export class EndpointBuilder<T extends Partial<EndpointDefinition>> implements AEndpointBuilder<T> {

    constructor(public readonly def: Readonly<T>) { }

    /**
     * Change the HTTP method of this endpoint
     * @param method Any valid HTTP method. See [[HttpMethod]].
     */
    public method<U extends HttpMethod>(method: U): EndpointBuilder<RemoveKey<T, 'method'> & { method: U }> {
        return new EndpointBuilder<T & { method: U }>(Object.assign({}, this.def, { method }));
    }

    /**
     * Change the type of the response.
     * 
     * You must provide a real object whose type will be inferred and used as the response type for this endpoint.
     * Rest.ts offers multiple ways to do this:
     * 
     * 1. Use a regular object.
     * For instance, if you need a string, use `'string'`, if you need a number, use `123`.
     * This also works for complex objects like so:
     *     
     *         GET `/current-user`
     *             .response({ 
     *                 id: 'string', 
     *                 kind: 'person' as 'person' | 'robot' | 'cat'
     *             })
     * 
     * 2. Some people like to use classes to define their DTOs. If this is your situation, you may just put the
     * class constructor here, and the instance type will be inferred.
     * 
     *         class CurrentUserDTO {
     *             id: string;
     *             kind: 'person' | 'robot' | 'cat';
     *         }
     *         
     *         GET `/current-user`
     *             .response(CurrentUserDTO)
     * 
     * 3. **(Preferred method)** Use a Runtype. [runtypes](https://github.com/pelotom/runtypes) is a 
     * library that allows you to create type definitions with runtime type metadata to ensure that
     * input data conforms to an expected type.  
     * Rest.ts has first-class support for runtypes:
     * 
     *         const CurrentUserDTO = rt.Record({
     *              id: rt.String,
     *              kind: rt.Union(
     *                  rt.String('person'),
     *                  rt.String('robot'),
     *                  rt.String('cat')
     *              )
     *         });
     *     
     *         GET `/current-user`
     *              .response(CurrentUserDTO)
     *    
     * @param response type of the response data.
     */
    public response<U>(response: U): EndpointBuilder<RemoveKey<T, 'response'> & { response: U }>  {
        return new EndpointBuilder<T & { response: U }>(Object.assign({}, this.def, { response }));
    }

    /**
     * Change the type of the request body.
     * 
     * You must provide a real object whose type will be inferred and used as the response type for this endpoint.
     * Rest.ts offers multiple ways to do this:
     * 
     * 1. Use a regular object.
     * For instance, if you need a string, use `'string'`, if you need a number, use `123`.
     * This also works for complex objects like so:
     *     
     *         POST `/current-user`
     *             .body({ 
     *                 id: 'string', 
     *                 kind: 'person' as 'person' | 'robot' | 'cat'
     *             })
     * 
     * 2. Some people like to use classes to define their DTOs. If this is your situation, you may just put the
     * class constructor here, and the instance type will be inferred.
     * 
     *         class CurrentUserDTO {
     *             id: string;
     *             kind: 'person' | 'robot' | 'cat';
     *         }
     *         
     *         POST `/current-user`
     *             .body(CurrentUserDTO)
     * 
     * 3. **(Preferred method)** Use a Runtype. [runtypes](https://github.com/pelotom/runtypes) is a 
     * library that allows you to create type definitions with runtime type metadata to ensure that
     * input data conforms to an expected type.  
     * Rest.ts has first-class support for runtypes:
     * 
     *         const CurrentUserDTO = rt.Record({
     *              id: rt.String,
     *              kind: rt.Union(
     *                  rt.String('person'),
     *                  rt.String('robot'),
     *                  rt.String('cat')
     *              )
     *         });
     *     
     *         POST `/current-user`
     *              .body(CurrentUserDTO)
     * 
     * rest-ts-express automatically type-checks incoming data when the body of the endpoint definition is a runtype.
     *    
     * @param response type of the response data.
     */
    public body<U>(body: U): EndpointBuilder<RemoveKey<T, 'body'> & { body: U }> {
        return new EndpointBuilder<T & { body: U }>(Object.assign({}, this.def, { body }));
    }

    /**
     * Add query parameters.
     * 
     * Note that query parameters are always optional (TODO: maybe don't enforce that?).
     * 
     * Example:
     * 
     *         GET `/users/search`
     *             .query({
     *                 'order': 'string',
     *                 'filter': 'string'
     *             })
     * 
     * @param query type of the query parameters.
     */
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

/**
 * Create a GET endpoint definition.
 * 
 * Use of the template literal allows to easily add dynamic path parameters to the endpoint definition, as shown in the example below.
 * 
 * Use as a tagged template literal to add path parameters to the endpoint, and use methods of 
 * the [[EndpointBuilder]] class to customize the endpoint definition.
 * 
 * This endpoint definition can be consumed by API servers and clients such as rest-ts-express and rest-ts-axios.
 * 
 * Example:
 * 
 *         export const carsAPI = defineAPI({
 *             // Get emissions test results for a given car.
 *             // For example: GET /cars/VW_Golf_TDI/results => "OK"
 *             getCarTestResults: GET `/cars/${'model'}/results`
 *                 .response(CarTestResults)
 *         });
 */
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

/**
 * Create a PUT endpoint definition.
 * 
 * Use of the template literal allows to easily add dynamic path parameters to the endpoint definition, as shown in the example below.
 * 
 * Use as a tagged template literal to add path parameters to the endpoint, and use methods of 
 * the [[EndpointBuilder]] class to customize the endpoint definition.
 * 
 * This endpoint definition can be consumed by API servers and clients such as rest-ts-express and rest-ts-axios.
 * 
 * Example:
 * 
 *         export const carsAPI = defineAPI({
 *             // Edit a car in the list
 *             // For example: PUT /cars/123/edit
 *             editCar: PUT `/cars/${'id'}/edit`
 *                 .body(CarAttributes)
 *                 .response(CarSaveResponse)
 *         });
 */
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

/**
 * Create a POST endpoint definition.
 * 
 * Use of the template literal allows to easily add dynamic path parameters to the endpoint definition, as shown in the example below.
 * 
 * Use as a tagged template literal to add path parameters to the endpoint, and use methods of 
 * the [[EndpointBuilder]] class to customize the endpoint definition.
 * 
 * This endpoint definition can be consumed by API servers and clients such as rest-ts-express and rest-ts-axios.
 * 
 * Example:
 * 
 *         export const commentsAPI = defineAPI({
 *             // Add a comment to an article
 *             // For example: POST /article/123/comment
 *             addComment: POST `/article/${'id'}/comment`
 *                 .body(CommentAttributes)
 *                 .response(CommentSaveResponse)
 *         });
 */
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

/**
 * Create a DELETE endpoint definition.
 * 
 * Use of the template literal allows to easily add dynamic path parameters to the endpoint definition, as shown in the example below.
 * 
 * Use as a tagged template literal to add path parameters to the endpoint, and use methods of 
 * the [[EndpointBuilder]] class to customize the endpoint definition.
 * 
 * This endpoint definition can be consumed by API servers and clients such as rest-ts-express and rest-ts-axios.
 * 
 * Example:
 * 
 *         export const commentsAPI = defineAPI({
 *             // Remove a comment 
 *             // For example: DELETE /comments/123
 *             removeComment: DELETE `/comments/${'id'}`
 *                 .response(CommentDeleteResponse)
 *         });
 */
export function DELETE(path: string | TemplateStringsArray): EndpointBuilder<EmptyInitialEndpointDefinition<'DELETE'>>;
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

/**
 * Create a PATCH endpoint definition.
 * 
 * Use of the template literal allows to easily add dynamic path parameters to the endpoint definition, as shown in the example below.
 * 
 * Use as a tagged template literal to add path parameters to the endpoint, and use methods of 
 * the [[EndpointBuilder]] class to customize the endpoint definition.
 * 
 * This endpoint definition can be consumed by API servers and clients such as rest-ts-express and rest-ts-axios.
 * 
 * Example:
 * 
 *         export const commentsAPI = defineAPI({
 *             // Edit a comment
 *             // For example: PATCH /article/123/comment/2
 *             editComment: PATCH `/article/${'id'}/comment/${'commentId'}`
 *                 .body(CommentAttributes)
 *                 .response(CommentSaveResponse)
 *         });
 */
export function PATCH(path: string | TemplateStringsArray): EndpointBuilder<EmptyInitialEndpointDefinition<'PATCH'>>;
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

/**
 * Create an API definition to share across producers and consumers of the API.
 * 
 * The usual workflow of rest-ts-core goes like this:
 * 
 * 1. Create an API definition:
 * 
 *         const myAwesomeAPI = defineAPI({
 *             someEndpoint: GET `/some/path`
 *                 .response(SomeResponseDTO)
 *         });
 * 
 * 2. Create a server for this API.  
 * rest-ts-express allows you to import the API definition you just created and
 * turn it into an express router. See the documentation for that package for more details.
 * 
 * 3. Create a consumer for this API.  
 * rest-ts-axios lets you create a typed instance of [axios](https://github.com/axios/axios) to
 * perform requests to your API.
 * 
 * 4. ... Profit!
 * 
 * 
 * Notice: Unless you are authoring an adapter for Rest.ts, you should always treat the return type of this function
 * as an opaque type. Use the utilities provided by this library to create the API definition within the brackets
 * of `defineAPI({ ... })`, and export the resulting symbol to be consumed by your server and client(s).  
 * The type you get from `defineAPI` is very complex, and for a good reason: it encodes all of the type information
 * of your API! It is pointless to inspect the raw type you get. Instead, we  recommend that you feed it directly 
 * to a compatible binding library such as rest-ts-express and rest-ts-axios. These libraries are able to decode 
 * the complex type and make sense out of it.
 * 
 * @param api 
 */
export const defineAPI = <T extends ApiDefinition>(api: T) => api;
