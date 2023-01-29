import { di } from '../../utils/di.js';
import { UserService } from '../user/user.service.js';
import { createController, mapToResponseError, respond } from '../../utils/response.js';
import { CommentService } from './comment.service.js';
import { CreateCommentSchemaBody, DeleteCommentSchemaQuery } from './comment.schema.js';
import { TodoService } from '../todo/todo.service.js';

const CommentController = di.record(
    UserService,
    CommentService,
    TodoService,
    (UserService, CommentService, TodoService) => ({
        createComment: createController(async (req, res) => {
            const user = await UserService.auth(req);

            const commentData = await CreateCommentSchemaBody.validate(req.body).catch(
                mapToResponseError({ notifyMessage: 'Could not create comment, invalid data' }),
            );
            await TodoService.ensureTodoExists(commentData.todoId);
            const comment = await CommentService.createComment({ ...commentData, userId: user.id });
            await TodoService.linkCommentTodo(user.id, comment.todoId, comment.id);

            respond({ res, data: CommentService.respondWith(comment) });
        }),
        deleteComment: createController(async (req, res) => {
            const user = await UserService.auth(req);

            const { id } = await DeleteCommentSchemaQuery.validate(req.params).catch(
                mapToResponseError({ notifyMessage: 'Could not delete comment, invalid data' }),
            );
            const comment = await CommentService.deleteComment(user.id, id);
            await TodoService.unlinkCommentTodo(user.id, comment.todoId, comment.id);

            respond({ res });
        }),
    }),
);

export { CommentController };
