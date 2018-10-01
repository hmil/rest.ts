import { ArrayDefinition, StringDefinition, NumberDefinition, RecordDefinition, DTO_Type } from './base-types';

// Core type framework of this package

export interface AEndpointBuilder<T> {
    def: T;
}

export type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE';

export type ArrayQueryParam = ArrayDefinition<StringDefinition | NumberDefinition | ArrayDefinition<StringDefinition | NumberDefinition>>;
export type QueryParam = StringDefinition | NumberDefinition | ArrayQueryParam | RecordDefinition<QueryParams>;
export type QueryParams = { [K: string]: QueryParam };

export interface EndpointDefinition {
    path: string[];
    method: HttpMethod;
    params?: string[];
    query?: QueryParams;
    body?: DTO_Type;
    response: DTO_Type;
}

export interface ApiDefinition {
    [k: string]: AEndpointBuilder<EndpointDefinition>;
}


