import * as rt from 'runtypes';

export const TodoItemType = rt.Union(
    rt.Literal('housekeeping'),
    rt.Literal('work'),
    rt.Literal('shopping')
)

export const TodoItem = rt.Record({
    id: rt.String,
    title: rt.String,
    done: rt.Boolean,
    listId: rt.String,
    type: TodoItemType
});

export const TodoList = rt.Record({
    id: rt.String,
    title: rt.String
});

export const CreateListRequest = rt.Record({
    title: rt.String
});

export const CreateTodoItemRequest = rt.Record({
    title: rt.String,
    type: TodoItemType
});

export const ResultPage = <T>(def: rt.Runtype<T>) => rt.Record({
    data: rt.Array(def),
    total: rt.Number,
    page: rt.Number,
    perPage: rt.Number,
    previousPage: rt.Union(rt.Number, rt.Null),
    nextPage: rt.Union(rt.Number, rt.Null)
});