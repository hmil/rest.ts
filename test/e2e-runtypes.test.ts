import { router } from './e2e-runtypes/todoAPIServer';
import { getClient } from './e2e-runtypes/todoAPIClient';
import * as express from 'express';

const client = getClient(`http://localhost:${port}${apiMountPoint}`);

beforeAll(async () => {
    const app = express()
    const port = 3000
    const apiMountPoint = '/api';

    app.use(apiMountPoint, router);

    await new Promise((resolve) => {
        app.listen(port, resolve);
    });
});

afterAll(() => {
});

test('basic', () => {
    const version = await client.version();
    console.log(`version: ${version}`);

    await client.createList({
        body: {
            title: 'Groceries'
        }
    });
    const houseList = await client.createList({
        body: {
            title: 'Home improvement'
        }
    });

    await client.findLists();

    await client.findLists({
        query: {
            searchQuery: 'home'
        }
    });

    await client.createTodo({
        params: {
            id: houseList.data.id
        },
        body: {
            title: 'Do the laundry',
            type: 'housekeeping'
        }
    });

    await client.moveTodo({
        params: {
            listId: '123',
            todoId: '456'
        }
    });
});
  