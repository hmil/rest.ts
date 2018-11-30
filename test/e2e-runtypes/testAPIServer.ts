import { todoAPI } from './testAPI';
import { buildRouter } from 'rest-ts-express';

export const router = buildRouter(todoAPI, (builder) => builder
    .simpleQueryParams((req) => {
        return {
            query1: req.query.query1,
            query2: req.query.query2 === 'true'
        };
    })
    .pathParams((req) => {
        return {
            path: req.path,
            kind: req.params['kind'],
            id: req.params['id']
        };
    })
    .noRepsonseEndpoint(async (req) => {
        // noop
    })
    .simpleRequestBody(async (req) => {
        return {
            id: 'deadbeef',
            ...req.body
        };
    })
    .simpleGet(() => 'OK')
    .simplePatch(() => 'OK')
    .simplePost(() => 'OK')
    .simplePut(() => 'OK')
    .simpleDelete(() => 'OK')
    .noTemplateString(() => 'OK')
);
