import { Router as ExpressRouter } from 'express';
import { di } from '../../utils/di.js';
import { LabelController } from './label.controller.js';

const LabelRouter = di.record(LabelController, (LabelController) => {
    const Router = ExpressRouter();

    Router.route('/labels').post(LabelController.createLabel).get(LabelController.getLabels);
    Router.route('/labels/:id')
        .put(LabelController.updateLabel)
        .delete(LabelController.deleteLabel);

    return Router;
});

export { LabelRouter };
