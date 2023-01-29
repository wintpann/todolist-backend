import { Router as ExpressRouter } from 'express';
import { di } from '../../utils/di.js';
import { UserController } from './user.controller.js';

const UserRouter = di.record(UserController, (UserController) => {
    const Router = ExpressRouter();

    Router.route('/users/login').post(UserController.login);
    Router.route('/users/signup').post(UserController.signup);
    Router.route('/users/refresh').post(UserController.refresh);
    Router.route('/users/me').get(UserController.me);

    return Router;
});

export { UserRouter };
