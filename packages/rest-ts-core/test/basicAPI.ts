import * as rt from 'runtypes';
import { defineAPI, GET, POST, PUT, createRouter, createConsumer } from '..';

const myAPI = defineAPI({

    listTodos: GET `/todos`
        .query({
            'q': rt.String
        }),

    addTodo: POST `/todos`,

    updateTodo: PUT `/todo/${'id'}`,

    linkTodos: PUT `/todo/link/${'parentTodo'}/to/${'childTodo'}/${'linkType'}`
});


const router = createRouter(myAPI, {
    listTodos: (req, res) => {
        console.log(`Searching for ${req.query.q}`);
    },

    addTodo: (req, res) => {

    },

    updateTodo: (req, res) => {

    },

    linkTodos: (req, res) => {

    }
});

const consumer = createConsumer('http://test/api', myAPI);

consumer.listTodos({
    query: {
        q: 'abc'
    }
});
