import * as rt from 'runtypes';
import { defineAPI, GET, POST, PUT, PATCH, DELETE } from 'rest-ts-core';
import { QueryParamsResponse, TodoItem, SavedTodoItem, SimpleMessage, PathData, ClassBasedRequest, ClassBasedResponse, protoBasedResponse, protoBasedRequest } from './DTOs';

/**
 * This is the API definition that will be shared between the backend and the frontend.
 */
export const todoAPI = defineAPI({

    simpleGet: GET `/method/get`
        .response(rt.String),

    simplePut: PUT `/method/put`
        .body(SimpleMessage)
        .response(rt.String),

    simplePost: POST `/method/post`
        .body(SimpleMessage)
        .response(rt.String),

    simplePatch: PATCH `/method/patch`
        .body(SimpleMessage)
        .response(rt.String),

    simpleDelete: DELETE `/method/delete`
        .response(rt.String),

    noTemplateString: GET('/path/string')
        .response(rt.String),

    simpleQueryParams: GET `/query`
        .query(rt.Record({
            'mandatory': rt.String,
            'union': rt.Union(rt.Literal('true'), rt.Literal('false')),
            'optional': rt.Union(rt.String, rt.Undefined)
        }))
        .response(QueryParamsResponse),

    simpleRequestBody: POST `/simpleBody`
        .body(TodoItem)
        .response(SavedTodoItem),

    noRepsonseEndpoint: PUT `/noResponse`,

    pathParams: GET `/path/${'kind'}/id/${'id'}`
        .response(PathData),

    constructorBodyAndResponse: POST `/withConstructor`
        .response(ClassBasedResponse)
        .body(ClassBasedRequest),

    protoBodyAndResponse: POST `/withProto`
        .response(protoBasedResponse)
        .body(protoBasedRequest)
});
