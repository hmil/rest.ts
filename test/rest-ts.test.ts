import { router } from './fixtures/testAPIServer';
import { getClient } from './fixtures/testAPIClient';
import * as express from 'express';
import * as http from 'http';
import { json } from 'body-parser';
import { ClassBasedRequest } from './fixtures/DTOs';
import { match } from 'minimatch';

const port = 3000
const apiMountPoint = '/api';
const client = getClient(`http://localhost:${port}${apiMountPoint}`);
const server = http.createServer();

beforeAll(async () => {
    const app = express();
    app.use(json());
    app.use(apiMountPoint, router);
    server.on('request', app);
    
    await new Promise((resolve) => {
        server.listen(port, resolve);
    });
});

afterAll(() => {
    server.close();
});

test('simple GET', async () => {
    const response = await client.simpleGet();
    expect(response.data).toEqual('OK');
});

test('simple POST', async () => {
    const response = await client.simplePost({
        body: { message: 'hello' }
    });
    expect(response.data).toEqual('OK');
});

test('simple PATCH', async () => {
    const response = await client.simplePatch({
        body: { message: 'hello' }
    });
    expect(response.data).toEqual('OK');
});

test('simple PUT', async () => {
    const response = await client.simplePut({
        body: { message: 'hello' }
    });
    expect(response.data).toEqual('OK');
});

test('simple DELETE', async () => {
    const response = await client.simpleDelete();
    expect(response.data).toEqual('OK');
});

test('no template string', async () => {
    await client.noTemplateString();
});

test('path parameters', async () => {
    const response = await client.pathParams({
        params: {
            kind: 'special',
            id: '3'
        }
    });
    expect(response.data.path).toEqual('/path/special/id/3')
    expect(response.data.kind).toEqual('special')
    expect(response.data.id).toEqual('3')
});

test('query params', async () => {
    const response = await client.simpleQueryParams({
        query: {
            union: 'true',
            mandatory: 'hello'
        }
    });
    expect(response.data.query1).toEqual('hello');
    expect(response.data.query2).toEqual(true);
});

test('bad query params', async () => {
    await expect(client.simpleQueryParams({
        query: {
            union: 'true',
            mandatory: null as any // Force an error
        }
    })).rejects.toHaveProperty('message', 'Request failed with status code 400');
});

test('request body', async () => {
    const response = await client.simpleRequestBody({
        body: {
            title: 'abc',
            done: false,
            type: 'shopping'
        }
    });
    expect(response.data.title).toEqual('abc');
    expect(response.data.done).toEqual(false);
    expect(response.data.type).toEqual('shopping');
    expect(response.data.id).toEqual('deadbeef');
});


test('bad request body', async () => {
    await expect(client.simpleRequestBody({
        body: {
            title: 'abc',
            done: false,
            type: 12 as any
        }
    })).rejects.toHaveProperty('message', 'Request failed with status code 400');
});

test('no response', async () => {
    // An endpoint with no response will yield a 404
    try {
        await client.noRepsonseEndpoint();
        fail('Expected an exception');
    } catch (e) {
        expect(e.response.status).toEqual(404);
    }
});

test('constructor-based', async () => {
    const response = await client.constructorBodyAndResponse({
        body: new ClassBasedRequest(
            'Hello world',
            'cat'
        )
    });

    expect(response.data.happy).toEqual(true);
    expect(response.data.lyrics).toEqual('Hello world');
});

test('prototype-based', async () => {
    const response = await client.protoBodyAndResponse({
        body: {
            messages: ['a', 'b'],
            kind: 'cat'
        }
    });
    expect(response.data.cats.map((c) => `(${c})`)).toEqual(['(a)', '(b)']);
    expect(response.data.isEnabled).toEqual(false);
});
