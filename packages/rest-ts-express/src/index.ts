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
interface TypedRequest<T extends EndpointDefinition> extends express.Request<Tuple2Dict<T['params']>, ExtractRuntimeType<T['response']>, ExtractRuntimeType<T['body']>, ExtractRuntimeType<T['query']>> {

}

/**
 * An individual endpoint handler.
 * 
 * Handles requests made to a given endpoint of the API, and returns the appropriate response.
 * Route handlers have their input and output types constrained by the API definition.
 * It is recommended you read the wiki page [express usage guide](https://github.com/hmil/rest.ts/wiki/Express-usage-guide)
 * first to get an idea of how this works, then come back here for the details.
 * 
 * Contrary to express handlers, rest.ts handlers usually don't need the `res` argument. Instead,
 * the desired response type should be returned from the function. rest.ts will serialize it and send it back to the client.
 * Using `res.send()` is an antipattern and should only be done as a last resort, if you clearly understand the consequences.
 * Note that if your handlers starts sending something out using the `res` object,
 * (ie. if the response headers get sent), then it must terminate the response itself.
 * 
 * Handlers can be asynchronous. If a promise is returned from the handler, rest.ts will await it before
 * continuing.
 * 
 * A handler can do one of three things: return some data, skip itself, or fail.
 * 
 * The first case is easy: The request was successful and the handler returns the expected DTO type, or
 * it returns a Promise which then gets resolved with a value.
 * 
 * The second case corresponds to calling `next` without arguments in express: the handler doesn't know
 * what to do with this request and forwards it to the next middleware in the server stack. You do this
 * by returning `undefined`, or, if you've returned a promise, by resolving the promise with `undefined`.
 * 
 * The third case happens if the handler throws an exception, or if it returns a promise which gets rejected.
 * The error is passed to express' error handling stack, where you can get a chance to further process it.
 * 
 * @param req **req** The express request object, with additional type information corresponding to the request parameters
 * defined in the API specification
 * @param res **res** The unmodified express response object. Only use this as a last resort. You should `return`
 * the response payload rather than passing it to `res.send()`
 * @return The response payload, which must be compatible with the response type defined in the API specification.
 * If a promise is returned: rejecting the promise has the same effect as throwing an exception in the handler, 
 * resolving the promise has the same effect as returning the resolving value directly from the handler.
 * **If the value is undefined, the request is passed down the next handler in the server stack.** If you don't
 * want your handler to return anything, call `res.end()` or make it return an empty string or something like that.
 */
export type RouteHandler<T extends EndpointDefinition> =
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
            const saneReq = sanitizeIncomingRequest(def, req);
            const data = await Promise.resolve(fn(saneReq, res));
            if (data !== undefined && !res.headersSent) {
                res.send(data);
            } else {
                next();
            }
        })()
        .catch(next);
    };
}

function sanitizeIncomingRequest<T extends EndpointDefinition>(def: T, req: express.Request<any, unknown, unknown, unknown>): TypedRequest<T> {
    if (req.body != null) {
        try {
            req.body = def.body == null ? null : deserialize(def.body, req.body);
        } catch (e) {
            throw new BadRequestHttpException(e);
        }
    }   
    if (req.query != null) {
        try {
            req.query = def.query == null ? null : deserialize(def.query, req.query);
        } catch (e) {
            throw new BadRequestHttpException(e);
        }
    }
    return req as TypedRequest<T>;
}

/* istanbul ignore next */
function ensureSwitchIsExhaustive(_t: never) { }
