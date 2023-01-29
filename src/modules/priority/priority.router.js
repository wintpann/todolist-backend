import { Router as ExpressRouter } from 'express';
import { di } from '../../utils/di.js';
import { PriorityController } from './priority.controller.js';

const PriorityRouter = di.record(PriorityController, (PriorityController) => {
    const Router = ExpressRouter();

    Router.route('/priorities')
        .post(PriorityController.createPriority)
        .get(PriorityController.getPriorities);
    Router.route('/priorities/:id')
        .put(PriorityController.updatePriority)
        .delete(PriorityController.deletePriority);

    return Router;
});

export { PriorityRouter };
