/**
 * @module rest-ts-express
 */

import { BadRequestHttpException } from '@senhung/http-exceptions';
import * as express from 'express';

import { ApiDefinition, EndpointDefinition, buildGenericPathname, ExtractRuntimeType, deserialize } from 'rest-ts-core';
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

type RouteHandler<T extends EndpointDefinition> =
    (req: TypedRequest<T>, res: express.Response) => PromiseOrValue<ExtractRuntimeType<T['response']>>;

type RouterDefinition<T extends ApiDefinition> = {
    [K in keyof T]: RouteHandler<T[K]['def']>;
};

type BuiltRouter<T extends ApiDefinition> = {
    _def: RouterDefinition<T>;
};

interface ERROR_ALREADY_DEFINED { };

type RouteHandlerBuilder<
        Api extends ApiDefinition,
        Built extends RouterDefinition<any>,
        K extends keyof Api,
        RemainingKeys extends keyof Api> =
    <H extends RouteHandler<Api[K]['def']>>(handler: H) => RouterBuilder<Api, Built & { [T in K]: H}, RemainingKeys extends K ? never : RemainingKeys>;

type RouterBuilder<T extends ApiDefinition, Built extends RouterDefinition<any>, RemainingKeys extends keyof T> = {
    [K in RemainingKeys]: K extends keyof Built ? ERROR_ALREADY_DEFINED : RouteHandlerBuilder<T, Built, K, RemainingKeys>;
} & {
    _def: Built
};

/**
 * Create an express.js router from an API definition.
 * 
 * This is the preferred way to construct a router with rest-ts-express. The builder pattern
 * allows you to catch many potential mistakes, such as a missing or extraneous definition, and
 * provides advanced type-checking of the handler code you write.
 * 
 * This method accepts a type definition and a callback. You create the router using the builder
 * passed to the callback. This builder has one method for each endpoint of the API definition,
 * this method lets you write the implementation of that endpoint.
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
 * Then you will implement the router like so:
 * ```ts
 * const router = buildRouter(myCustomAPI, (builder) => builder
 *      .listPublications((req, res) => {
 *          return requestDatabaseForPublications({category: req.params.category})
 *      })
 *      .addPublication(async (req, res) => {
 *          const saved = await attemptSavePublication(req.body);
 *          return { id: saved.id };
 *      })
 *      .removePublication(async (req, res) => {
 *          await removePublication({ id: req.params.id });
 *          return 'OK';
 *      })
 * );
 * ```
 * 
 * Attach your router to some express server just like any other regular router:
 * ```ts
 * const app = express();
 * app.use('/api/root', router);
 * ```
 * 
 * @param apiDefinition The API definition you want to implement
 * @param cb A construction callback
 */
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

/**
 * Alternate way to create a router.
 * 
 * You should use {@link buildRouter} whenever possible. It provides more safety and plays better with IDEs than
 * this method.
 * 
 * This function works similarly to {@link buildRouter} except that you pass a simple object hash and don't use a builder.
 * Each property of the hash is a route handler for the endpoint of the same name.
 * 
 * Example:
 * ```ts
 * const router = createRouter(myCustomAPI, {
 *      listPublications: (req, res) => {
 *          return requestDatabaseForPublications({category: req.params.category})
 *      },
 *      addPublication: async (req, res) => {
 *          const saved = await attemptSavePublication(req.body);
 *          return { id: saved.id };
 *      },
 *      removePublication: async (req, res) => {
 *          await removePublication({ id: req.params.id });
 *          return 'OK';
 *      }
 * );
 * ```
 * @param apiDefinition The API definition you want to implement.
 * @param hash The concrete implementation of the API.
 */
export function createRouter<T extends ApiDefinition>(apiDefinition: T, hash: RouterDefinition<T>): express.Router {
    const router = express.Router();
    Object.keys(apiDefinition).forEach((i) => {
        const endpoint = apiDefinition[i];
        const def = endpoint.def;
        const path = buildGenericPathname(def);
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

function makeHandler<T extends EndpointDefinition>(def: T, fn: RouteHandler<T>) {
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
