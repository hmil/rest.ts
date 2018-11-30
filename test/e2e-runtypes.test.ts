import { router } from './e2e-runtypes/testAPIServer';
import { getClient } from './e2e-runtypes/testAPIClient';
import * as express from 'express';
import * as http from 'http';
import { json } from 'body-parser';

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
            query1: 'hello',
            query2: 'true'
        }
    });
    expect(response.data.query1).toEqual('hello');
    expect(response.data.query2).toEqual(true);
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
