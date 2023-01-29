import { Router as ExpressRouter } from 'express';
import { di } from '../../utils/di.js';
import { TodoController } from './todo.controller.js';

const TodoRouter = di.record(TodoController, (TodoController) => {
    const Router = ExpressRouter();

    Router.route('/todos').post(TodoController.createTodo);
    Router.route('/todos').get(TodoController.getTodos);
    Router.route('/todos/:id')
        .put(TodoController.updateTodo)
        .delete(TodoController.deleteTodo)
        .get(TodoController.getTodo);

    return Router;
});

export { TodoRouter };
