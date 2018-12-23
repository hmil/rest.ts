/**
 * @module rest-ts-express
 */

import { BadRequestHttpException } from '@senhung/http-exceptions';
import * as express from 'express';

import { ApiDefinition, EndpointDefinition, RemoveKey, Diff } from 'rest-ts-core';
import { getPathWithParams } from 'rest-ts-core';
import { ExtractRuntimeType, deserialize } from 'rest-ts-core';
import { Tuple2Dict } from 'rest-ts-core';

/**
 * A promise of T or just T.
 */
type PromiseOrValue<T> = PromiseLike<T> | T;


/**
 * An express Request with proper typings.
 */
interface TypedRequest<T extends EndpointDefinition> extends express.Request {
    body: ExtractRuntimeType<T['body']>;
    params: Tuple2Dict<T['params']>;
    query: ExtractRuntimeType<T['query']>;
}

export type RouteHandler<T extends EndpointDefinition> =
    (req: TypedRequest<T>, res: express.Response) => PromiseOrValue<ExtractRuntimeType<T['response']>>;

export type RouterDefinition<T extends ApiDefinition> = {
    [K in keyof T]: RouteHandler<T[K]['def']>;
};

export type BuiltRouter<T extends ApiDefinition> = {
    _def: RouterDefinition<T>;
};

export type RemoveKey2<T, K extends keyof T> = {
    [Key in keyof T]: Key extends K ? never : T[Key];
}

export interface ERROR_ALREADY_DEFINED { };

export type RouteHandlerBuilder<
        Api extends ApiDefinition,
        Built extends RouterDefinition<any>,
        K extends keyof Api,
        RemainingKeys extends keyof Api> =
    <H extends RouteHandler<Api[K]['def']>>(handler: H) => RouterBuilder<Api, Built & { [T in K]: H}, RemainingKeys extends K ? never : RemainingKeys>;

export type RouterBuilder<T extends ApiDefinition, Built extends RouterDefinition<any>, RemainingKeys extends keyof T> = {
    [K in RemainingKeys]: K extends keyof Built ? ERROR_ALREADY_DEFINED : RouteHandlerBuilder<T, Built, K, RemainingKeys>;
} & {
    _def: Built
};

export function buildRouter<T extends ApiDefinition>(apiDefinition: T, cb: (builder: RouterBuilder<T, {}, keyof T>) => BuiltRouter<T>) {
    const builder = {
        _def: {}
    } as any;
    Object.keys(apiDefinition).forEach((i) => {
        builder[i] = (handler: RouteHandler<any>) => {
            builder._def[i] = handler;
            return builder;
        }
    });
    return createRouter(apiDefinition, cb(builder)._def);
}

export function createRouter<T extends ApiDefinition>(apiDefinition: T, hash: RouterDefinition<T>): express.Router {
    const router = express.Router();
    Object.keys(apiDefinition).forEach((i) => {
        const endpoint = apiDefinition[i];
        const def = endpoint.def;
        const path = getPathWithParams(def);
        switch (endpoint.def.method) {
            case 'GET':
                router.get(path, makeHandler(def, hash[i].bind(hash)));
                break;
            case 'POST':
                router.post(path, makeHandler(def, hash[i].bind(hash)));
                break;
            case 'PUT':
                router.put(path, makeHandler(def, hash[i].bind(hash)));
                break;
            case 'PATCH':
                router.patch(path, makeHandler(def, hash[i].bind(hash)));
                break;
            case 'DELETE':
                router.delete(path, makeHandler(def, hash[i].bind(hash)));
                break;
            /* istanbul ignore next: Guaranteed safe by the type system */
            default:
                ensureSwitchIsExhaustive(endpoint.def.method);
        }
    });
    return router;
}

export function makeHandler<T extends EndpointDefinition>(def: T, fn: RouteHandler<T>) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        (async () => {
            sanitizeIncomingRequest(def, req);
            const data = await Promise.resolve(fn(req, res));
            if (data !== undefined && !res.headersSent) {
                res.send(data);
            } else {
                next();
            }
        })()
        .catch(next);
    };
}

function sanitizeIncomingRequest(def: EndpointDefinition, req: express.Request) {
    if (req.body != null) {
        try {
            req.body = def.body == null ? null : deserialize(def.body, req.body);
        } catch (e) {
            throw new BadRequestHttpException(e);
        }
    }
}

/* istanbul ignore next */
function ensureSwitchIsExhaustive(_t: never) { }
