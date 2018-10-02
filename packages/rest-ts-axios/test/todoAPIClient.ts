import { createConsumer } from '..';
import { todoAPI } from 'rest-ts-core/test/todoAPI';
import { ExtractRuntimeType } from 'rest-ts-core';
import { ExtractBaseType } from 'rest-ts-core/dist/base-types';

const api = createConsumer('http://localhost:3000/api', todoAPI);



async function example1() {

    const version = await api.version();

    await api.createList({
        body: {
            title: 'Groceries'
        }
    });
    const houseList = await api.createList({
        body: {
            title: 'Home improvement'
        }
    });

    const allLists = await api.findLists();

    const houseLists = await api.findLists({
        query: {
            searchQuery: 'home'
        }
    });

    await api.createTodo({
        params: {
            id: houseList.data.id
        },
        body: {
            title: 'Do the laundry',
            type: 'housekeeping'
        }
    });
}


