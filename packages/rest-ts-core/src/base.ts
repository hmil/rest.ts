import { DTO_Type, QueryParamType } from './base-types';

// Core type framework of this package

export interface AEndpointBuilder<T> {
    def: T;
}

export type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE';

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


