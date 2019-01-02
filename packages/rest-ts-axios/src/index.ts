/**
 * @module rest-ts-axios
 */

import { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiDefinition, EndpointDefinition, Tuple2Dict, ExtractRuntimeType, buildPathnameFromParams } from 'rest-ts-core';

type IsInRecord<T, Key extends keyof T> = T extends Record<Key, any> ? Key : never;
type KeyIfDefined<T, Key extends keyof T> = Key extends IsInRecord<T, Key> ? Key : never;

interface TypedAxiosResponse<T extends EndpointDefinition> extends AxiosResponse {
    data: ExtractRuntimeType<T['response']>;
}

type RouteConsumerParams<T extends EndpointDefinition> = {
    [K in KeyIfDefined<T, 'params' | 'query' | 'body'>]:
        K extends 'params' ? Tuple2Dict<T[K]> :
        K extends 'query' ? Partial<ExtractRuntimeType<T[K]>> :
        ExtractRuntimeType<T[K]>;
} & AxiosRequestConfig;

type UnknownRouteConsumerParams = {
    params?: { [key: string]: string };
    query: { [key: string]: unknown };
    body: unknown;
};

type RouteConsumer<T extends EndpointDefinition> = KeyIfDefined<T, 'params' | 'body'> extends never ?
    // If the only property set is the query, then the parameter hash is optional
    T extends Record<'query', any> ? (params?: RouteConsumerParams<T>) => Promise<TypedAxiosResponse<T>>
    // Otherwise, (if none of the keys are set), the function takes no parameter at all
    : () => Promise<TypedAxiosResponse<T>>
    // If any other key is set, the parameter hash is required
    : (params: RouteConsumerParams<T>) => Promise<TypedAxiosResponse<T>>;

/**
 * Thin wrapper around an instance of axios.
 * 
 * You can only obtain an ApiConsumer through {@link createConsumer}.
 * 
 * This object has a method defined for each endpoint of the API definition used to create it.
 * 
 * For instance, if your API definition has the following endpoints:
 * ```ts
 * const myCustomAPI = defineAPI({    
 *     listPublications: GET `/publications/${'category'}` .response(Publications),
 *     addPublication: POST `/publications` .body(Article) .response(PublicationResponse),
 *     removePublication: DELETE `/publications/${'id'}` .response(RemoveResponse)
 * });
 * ```
 * 
 * Then, the ApiConsumer you obtain has the following methods:
 * ```ts
 * consumer.listPublications({ params: { category: string } }) => { data: Publications }
 * consumer.addPublication({ body: Article }) => { data: PublicationResponse }
 * consumer.removePublication({ params: { id: string } }) => { data: RemoveResponse }
 * ```
 * 
 * Note that, in addition to the types shown above, you may pass any option accepted in the
 * method parameter, and the object you get in response is an actual axios response.
 * These have been omitted from the example above for clarity.  
 * If you are interested in the exact type definiton, feel free to browse the source code.
 * You will find that there is very little code logic, and that most of the work done by
 * this module happens in the type system, not the runtime.
 */
export type ApiConsumer<T extends ApiDefinition> = {
    [K in keyof T]: RouteConsumer<T[K]['def']>;
};

/**
 * Bind an API definition to an instance of axios.
 * 
 * Use this method as a factory to make {@link ApiConsumer}s from {@link ApiDefinition}s.
 * 
 * Use the returned object to make requests against the chosen API.
 * 
 * ## Example
 * 
 * ```ts
 * // Step 1: Import the API definition you created with `rest-ts-core`
 * import { myCustomAPI } from 'shared/apis/myCustomAPI';
 * 
 * // Step 2: Create an axios instance with a given base URL.
 * // You can also customize global settings such as authentication or custom headers.
 * // Refer to the docs for axios to see all of the available settings.
 * const driver = axios.instance({
 *   baseURL: 'http://localhost:3000/api',
 *   // You can add global settings here such as authentication headers
 * });
 * 
 * // Step 3: Bind the API definition to the axios instance
 * const consumer = createConsumer(apiDefinition, myCustomAPI);
 * 
 * // Step 4: You can now use this object in your application to make HTTP calls to your backend:
 * const res = consumer.listAllPublications({
 *     // The parameters that you defined in your API will be required here.
 *     // However, this object is passed directly to your axios instance, and you can add
 *     // any parameter that axios accepts.
 *     params: {
 *         category: 'life sciences'
 *     }
 * });
 * ```
 * 
 * @param apiDefinition The API definition to bind.
 * @param axios An axios instance
 */
export function createConsumer<T extends ApiDefinition>(apiDefinition: T, axios: AxiosInstance): ApiConsumer<T> {
    const ret: ApiConsumer<T> = {} as any;
    for (const i of Object.keys(apiDefinition)) {
        ret[i] = makeAxiosEndpoint(axios, apiDefinition[i].def) as any;
    }
    return ret;
}

function makeAxiosEndpoint<T extends EndpointDefinition>(axios: AxiosInstance, def: T): RouteConsumer<EndpointDefinition> {
    function handler(): Promise<TypedAxiosResponse<T>>;
    function handler(args: UnknownRouteConsumerParams): Promise<TypedAxiosResponse<T>>;
    function handler(args?: UnknownRouteConsumerParams): Promise<TypedAxiosResponse<T>> {
        const params = args != null ? args.params : undefined;
        const body = args != null ? args.body : undefined;
        const query = args != null ? args.query : undefined;
        return axios({
            method: def.method.toLowerCase(),
            url: buildPathnameFromParams(def, params),
            params: query,
            data: body
        });
    }
    return handler;
}
