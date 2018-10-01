import axios, { AxiosResponse } from 'axios';
import { ApiDefinition, EndpointDefinition, Tuple2Dict, ExtractRuntimeType, makePathWithParams } from 'rest-ts-core';

type IsInRecord<T, Key extends keyof T> = T extends Record<Key, any> ? Key : never;
type KeyIfDefined<T, Key extends keyof T> = Key extends IsInRecord<T, Key> ? Key : never;

interface TypedAxiosResponse<T extends EndpointDefinition> extends AxiosResponse {
    data: ExtractRuntimeType<T['response']>;
}

type RouteConsumerParams<T extends EndpointDefinition> = {
    [K in KeyIfDefined<T, 'params' | 'query' | 'body'>]: K extends 'params' ? Tuple2Dict<T[K]> : ExtractRuntimeType<T[K]>;
};

type UnknownRouteConsumerParams = {
    params?: { [key: string]: string };
    query: { [key: string]: unknown };
    body: unknown;
};

type RouteConsumer<T extends EndpointDefinition> = KeyIfDefined<T, 'params' | 'query' | 'body'> extends never ?
    () => Promise<TypedAxiosResponse<T>> :
    (params: RouteConsumerParams<T>) => Promise<TypedAxiosResponse<T>>;

export type ApiConsumer<T extends ApiDefinition> = {
    [K in keyof T]: RouteConsumer<T[K]['def']>;
};

export function createConsumer<T extends ApiDefinition>(baseURL: string, apiDefinition: T): ApiConsumer<T> {
    const ret: ApiConsumer<T> = {} as any;
    for (const i of Object.keys(apiDefinition)) {
        ret[i] = makeAxiosEndpoint(baseURL, apiDefinition[i].def) as any;
    }
    return ret;
}

function makeAxiosEndpoint<T extends EndpointDefinition>(baseURL: string, def: T): RouteConsumer<EndpointDefinition> {
    function handler(): Promise<TypedAxiosResponse<T>>;
    function handler(args: UnknownRouteConsumerParams): Promise<TypedAxiosResponse<T>>;
    function handler(args?: UnknownRouteConsumerParams): Promise<TypedAxiosResponse<T>> {
        const params = args != null ? args.params : undefined;
        const body = args != null ? args.body : undefined;
        const query = args != null ? args.query : undefined;
        return axios({
            baseURL,
            method: def.method.toLowerCase(),
            url: makePathWithParams(def, params),
            params: query,
            data: body
        });
    }
    return handler;
}
