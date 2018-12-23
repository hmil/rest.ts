/**
 * @module rest-ts-core
 */

 import { DTO_Type, QueryParamType } from './base-types';

// Core type framework of this package

export interface AEndpointBuilder<T> {
    def: T;
}

/**
 * List of the supported HTTP verbs.
 * 
 * If you think something is missing here, feel free to open an issue.
 */
export type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH';

export type QueryParams = { [K: string]: QueryParamType };

export interface EndpointDefinition {
    path: string[];
    method: HttpMethod;
    params?: string[];
    query?: QueryParams;
    body?: DTO_Type;
    response: DTO_Type | undefined;
}

export interface ApiDefinition {
    [k: string]: AEndpointBuilder<EndpointDefinition>;
}


