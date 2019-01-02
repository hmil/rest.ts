/**
 * @module rest-ts-core
 */

import * as rt from 'runtypes';
import { DTO_Type } from './private/base-types';

// Core type framework of this package

export interface AEndpointBuilder<T> {
    def: T;
}

/**
 * List of the supported HTTP methods.
 * 
 * If you think something is missing here, feel free to open a pull request.
 */
export type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH';

/**
 * Object containing the query parameters accepted by an endpoint. 
 */
export type QueryParams = { [K: string]: QueryParamType };

/**
 * Type of an individual query parameter.
 */
export type QueryParamType = rt.Runtype<any> | any;

/**
 * Typed definition of an individual REST endpoint.
 * 
 * Users of Rest.ts normally don't interact with this type directly. Libraries will
 * extract the relevant information from this type in order to provide a user-friendly
 * interface for API producers or consumers.
 */
export interface EndpointDefinition {
    path: string[];
    method: HttpMethod;
    params?: string[];
    query?: QueryParams;
    body?: DTO_Type;
    response: DTO_Type | undefined;
}

/**
 * Complete type definition of a REST API.
 * 
 * For most users, this type should be treated as an opaque type.
 * You will pass objects of type ApiDefinition to a method of
 * `rest-ts-express`, `rest-ts-core`, or any compatible library, and that
 * library will use the type to create a beautiful, user-friendly interface for your API.
 */
export interface ApiDefinition {
    [k: string]: AEndpointBuilder<EndpointDefinition>;
}


