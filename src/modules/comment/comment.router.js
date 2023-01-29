import { Router as ExpressRouter } from 'express';
import { di } from '../../utils/di.js';
import { CommentController } from './comment.controller.js';

const CommentRouter = di.record(CommentController, (CommentController) => {
    const Router = ExpressRouter();

    Router.route('/comments').post(CommentController.createComment);
    Router.route('/comments/:id').delete(CommentController.deleteComment);

    return Router;
});

export { CommentRouter };
