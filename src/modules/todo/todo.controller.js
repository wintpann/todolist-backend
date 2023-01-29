import { di } from '../../utils/di.js';
import { TodoService } from './todo.service.js';
import { UserService } from '../user/user.service.js';
import { CommentService } from '../comment/comment.service.js';
import {
    CreateTodoSchemaBody,
    DeleteTodoSchemaQuery,
    GetTodosSchemaQuery,
    UpdateTodoSchemaBody,
    UpdateTodoSchemaQuery,
} from './todo.schema.js';
import { createController, mapToResponseError, respond } from '../../utils/response.js';
import { cleanObject } from '../../utils/common.js';

const TodoController = di.record(
    TodoService,
    UserService,
    CommentService,
    (TodoService, UserService, CommentService) => ({
        createTodo: createController(async (req, res) => {
            const user = await UserService.auth(req);

            const todoData = await CreateTodoSchemaBody.validate(req.body).catch(
                mapToResponseError({ notifyMessage: 'Could not create todo, invalid data' }),
            );
            const todo = await TodoService.createTodo({ ...todoData, userId: user.id });
            const data = await TodoService.respondWith(todo);

            respond({ res, data });
        }),
        updateTodo: createController(async (req, res) => {
            const user = await UserService.auth(req);

            const { id } = await UpdateTodoSchemaQuery.validate(req.params).catch(
                mapToResponseError({ message: 'Id was not provided' }),
            );
            const todoData = await UpdateTodoSchemaBody.validate(req.body).catch(
                mapToResponseError({ notifyMessage: 'Could not update todo, invalid data' }),
            );

            const updated = await TodoService.updateTodo(user.id, id, (todo) => ({
                ...todo,
                ...cleanObject(todoData),
            }));
            const data = await TodoService.respondWith(updated);

            respond({ res, data });
        }),
        deleteTodo: createController(async (req, res) => {
            const user = await UserService.auth(req);

            const { id } = await DeleteTodoSchemaQuery.validate(req.params).catch(
                mapToResponseError({ message: 'Id was not provided' }),
            );
            const todo = await TodoService.deleteTodo(user.id, id);
            await CommentService.deleteComments(user.id, todo.commentIds);

            respond({ res });
        }),
        getTodos: createController(async (req, res) => {
            const user = await UserService.auth(req);

            const { checked, labelIds, priorityIds, fromDueDate, toDueDate } =
                await GetTodosSchemaQuery.validate(req.query).catch(
                    mapToResponseError({
                        notifyMessage: 'Could not find todos, invalid search params',
                    }),
                );

            const todos = await TodoService.getUserTodosFiltered({
                userId: user.id,
                checked,
                labelIds,
                priorityIds,
                fromDueDate,
                toDueDate,
            });
            const data = await Promise.all(todos.map(TodoService.respondWith));

            respond({ res, data });
        }),
        getTodo: createController(async (req, res) => {
            const user = await UserService.auth(req);

            const { id } = await GetTodosSchemaQuery.validate(req.params).catch(
                mapToResponseError({ message: 'Id was not provided' }),
            );
            const todo = await TodoService.getUserTodo(user.id, id);
            const data = await TodoService.respondWith(todo);

            respond({ res, data });
        }),
    }),
);

export { TodoController };
