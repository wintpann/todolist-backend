import { v4 } from 'uuid';
import { di } from '../../utils/di.js';
import { findByPredicate } from '../../utils/common.js';
import omit from 'lodash/omit.js';

const PriorityService = di.record(di.key()('db'), (db) => {
    const getById = async (id) => {
        return findByPredicate(db.data.priorities, (priority) => priority.id === id);
    };

    const getUserPriorities = async (userId) => {
        return db.data.priorities.filter((priority) => priority.userId === userId);
    };

    const getTodoPriority = async (todoId) => {
        const [priority] = findByPredicate(
            db.data.priorities,
            (priority) => priority.todoId === todoId,
        );
        return priority;
    };

    const isTitleUnique = async (userId, title) => {
        const userPriorities = await getUserPriorities(userId);
        const hasSamePriority = userPriorities.some((priority) => priority.title === title);

        return !hasSamePriority;
    };

    const createPriority = async ({ title, color, userId }) => {
        const priority = {
            title,
            color,
            userId,
            id: v4(),
        };

        db.data.priorities.push(priority);
        db.update();
        return priority;
    };

    const updatePriority = async (userId, id, callback) => {
        const [priority, index] = await getById(id);

        if (!priority || priority.userId !== userId) {
            throw new Error('No priority was found by id', id);
        }

        const updated = { ...priority, ...callback(priority) };
        db.data.priorities[index] = updated;

        db.update();
        return updated;
    };

    const deletePriority = async (userId, id) => {
        const [priority, index] = await getById(id);

        if (!priority || priority.userId !== userId) {
            throw new Error('No priority was found by id', id);
        }

        db.data.priorities.splice(index, 1);
        db.update();
    };

    const ensurePriorityExists = async (userId, priorityId) => {
        if (!priorityId) return;

        const userPriorities = await getUserPriorities(userId);
        const priorityExists = userPriorities.some(({ id }) => id === priorityId);

        if (!priorityExists) {
            throw new Error('Provided priority does not exist');
        }
    };

    const respondWith = (priority) => omit(priority, ['userId']);

    return {
        getById,
        getUserPriorities,
        getTodoPriority,
        createPriority,
        updatePriority,
        deletePriority,
        ensurePriorityExists,
        isTitleUnique,
        respondWith,
    };
});

export { PriorityService };
