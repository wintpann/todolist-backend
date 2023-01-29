import { v4 } from 'uuid';
import { di } from '../../utils/di.js';
import omit from 'lodash/omit.js';
import { findByPredicate } from '../../utils/common.js';

const CommentService = di.record(di.key()('db'), (db) => {
    const getById = async (id) => {
        return findByPredicate(db.data.comments, (comment) => comment.id === id);
    };

    const getUserComments = async (userId) => {
        return db.data.comments.filter((comment) => comment.userId === userId);
    };

    const getTodoComments = async (todoId) => {
        return db.data.comments.filter((comment) => comment.todoId === todoId);
    };

    const createComment = async ({ content, todoId, userId }) => {
        const comment = {
            content,
            todoId,
            userId,
            id: v4(),
        };
        db.data.comments.push(comment);

        db.update();
        return comment;
    };

    const deleteComment = async (userId, id) => {
        const [comment, index] = await getById(id);
        if (!comment || comment.userId !== userId) {
            throw new Error('No comment was found by id', id);
        }

        db.data.comments.splice(index, 1);
        db.update();
        return comment;
    };

    const deleteComments = async (userId, ids) => {
        const userComments = await getUserComments(userId);
        const userCommentsSet = new Set(userComments.map(({ id }) => id));
        const idsSet = new Set(ids);

        db.data.comments = db.data.comments.filter((comment) => {
            const shouldDelete = idsSet.has(comment.id) && userCommentsSet.has(comment.id);
            return !shouldDelete;
        });

        db.update();
    };

    const ensureCommentsExist = async (userId, commentIds) => {
        const userComments = await getUserComments(userId);
        const userCommentsSet = new Set(userComments.map(({ id }) => id));

        const allCommentsExist = commentIds.every((id) => userCommentsSet.has(id));
        if (!allCommentsExist) {
            throw new Error('Not all provided comments exist');
        }
    };

    const respondWith = (comment) => omit(comment, ['userId']);

    return {
        getById,
        getUserComments,
        getTodoComments,
        createComment,
        deleteComment,
        deleteComments,
        ensureCommentsExist,
        respondWith,
    };
});

export { CommentService };
