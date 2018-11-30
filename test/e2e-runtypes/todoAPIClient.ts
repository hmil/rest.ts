import { createConsumer } from 'rest-ts-axios';
import axios from 'axios';
import { todoAPI } from './todoAPI';

const api = createConsumer(todoAPI, axios.create({
    baseURL: 'http://localhost:3000/api'
}));

async function example1() {

    const version = await api.version();
    console.log(`version: ${version}`);

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

    await api.findLists();

    await api.findLists({
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

    await api.moveTodo({
        params: {
            listId: '123',
            todoId: '456'
        }
    });
}

example1().catch((e) => console.error(e));
