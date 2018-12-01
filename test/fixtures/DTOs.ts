import * as rt from 'runtypes';

export const QueryParamsResponse = rt.Record({
    query1: rt.String,
    query2: rt.Boolean
});

export const TodoItemType = rt.Union(
    rt.Literal('housekeeping'),
    rt.Literal('work'),
    rt.Literal('shopping')
);

export const TodoItem = rt.Record({
    title: rt.String,
    done: rt.Boolean,
    type: TodoItemType
});


export const SavedTodoItem = rt.Intersect(
    TodoItem,
    rt.Record({
        id: rt.String
    })
);

export const SimpleMessage = rt.Record({
    message: rt.String
});

export const PathData = rt.Record({
    path: rt.String,
    kind: rt.String,
    id: rt.String
});

export class ClassBasedRequest {
    constructor(
            public message: string,
            public kind: 'person' | 'cat') {
    }   
}

export class ClassBasedResponse {
    constructor(
            public lyrics: string,
            public happy: boolean) {
    }
}
