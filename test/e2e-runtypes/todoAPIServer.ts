import { createRouter } from 'rest-ts-express';
import { todoAPI } from './todoAPI';
import { TodoList, ResultPage, TodoItem } from './DTOs';

export const router = createRouter(todoAPI, {
    version: async () => '1',

    findLists: async () => {
        return ResultPage(TodoList).check({
            data: [],
            total: 0,
            page: 0,
            perPage: 0,
            previousPage: 0,
            nextPage: 0
        });
    },
    
    getListItems: async () => {
        return ResultPage(TodoItem).check({
            data: [],
            total: 0,
            page: 0,
            perPage: 0,
            previousPage: 0,
            nextPage: 0
        });
    },

    createList: async () => {
        return {
            id: 'foo',
            title: 'bar'
        };
    },
    
    updateList: async () => {
        return {
            id: 'foo',
            title: 'bar'
        };
    },
    
    createTodo: async () => {
        return {
            id: 'test',
            title: 'a',
            done: false,
            listId: '123',
            type: 'shopping' as 'shopping'
        };
    },

    moveTodo: async () => { },
});
