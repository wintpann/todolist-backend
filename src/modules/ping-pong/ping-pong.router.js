import { Router as ExpressRouter } from 'express';
import { di } from '../../utils/di.js';
import { PingPongController } from './ping-pong.controller.js';

const PingPongRouter = di.record(PingPongController, (PingPongController) => {
    const Router = ExpressRouter();

    Router.route('/ping').get(PingPongController.ping);

    return Router;
});

export { PingPongRouter };
