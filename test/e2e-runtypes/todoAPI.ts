import * as rt from 'runtypes';
import { defineAPI, GET, POST, PUT, PATCH } from 'rest-ts-core';
import { ResultPage, TodoList, TodoItem, CreateListRequest, CreateTodoItemRequest } from './DTOs';

/**
 * This is the API definition that will be shared between the backend and the frontend.
 */
export const todoAPI = defineAPI({

    version: GET `/version`
        .response(rt.String),

    findLists: GET `/lists`
        .query({
            'searchQuery': rt.String,
            'onlyMyLists': rt.Union(rt.Literal('true'), rt.Literal('false'))
        })
        .response(ResultPage(TodoList)),
    
    getListItems: GET `/list/${'id'}`
        .response(ResultPage(TodoItem)),

    createList: POST `/lists`
        .body(CreateListRequest)
        .response(TodoList),
    
    updateList: PATCH `/list/${'id'}`
        .body(CreateListRequest)
        .response(TodoList),
    
    createTodo: POST `/list/${'id'}/add`
        .body(CreateTodoItemRequest)
        .response(TodoItem),

    moveTodo: PUT `/todos/${'todoId'}/moveTo/${'listId'}`,
});
