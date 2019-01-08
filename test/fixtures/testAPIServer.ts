import { todoAPI } from './testAPI';
import { buildRouter } from 'rest-ts-express';

export const router = buildRouter(todoAPI, (builder) => builder
    .simpleQueryParams((req) => {
        return {
            query1: req.query.mandatory,
            query2: req.query.union === 'true'
        };
    })
    .pathParams((req) => {
        return {
            path: req.path,
            kind: req.params['kind'],
            id: req.params['id']
        };
    })
    .noRepsonseEndpoint(async (req, res) => {
        // no-op. Will 404
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
    .constructorBodyAndResponse((req) => {
        return {
            happy: req.body.kind === 'cat',
            lyrics: req.body.message
        };
    })
    .protoBodyAndResponse((req) => {
        return {
            cats: req.body.messages,
            isEnabled: req.body.kind === 'person'
        };
    })
    .optionalQueryParams(async (req, res) => {
        res.end(); // no-op, but does not 404
    })
);
