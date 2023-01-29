import { di } from '../../utils/di.js';
import {
    createController,
    mapToResponseError,
    respond,
    ResponseError,
} from '../../utils/response.js';
import { UserService } from '../user/user.service.js';
import { TodoService } from '../todo/todo.service.js';

import { PriorityService } from './priority.service.js';
import {
    CreatePrioritySchemaBody,
    DeletePrioritySchemaQuery,
    UpdatePrioritySchemaBody,
    UpdatePrioritySchemaQuery,
} from './priority.schema.js';
import { cleanObject } from '../../utils/common.js';

const PriorityController = di.record(
    PriorityService,
    UserService,
    TodoService,
    (PriorityService, UserService, TodoService) => ({
        createPriority: createController(async (req, res) => {
            const user = await UserService.auth(req);
            const { title, color } = await CreatePrioritySchemaBody.validate(req.body).catch(
                mapToResponseError({
                    notifyMessage: 'Could not create priority, invalid data',
                }),
            );

            const isUnique = await PriorityService.isTitleUnique(user.id, title);

            if (!isUnique) {
                throw new ResponseError({ notifyMessage: 'Priority title should be unique' });
            }

            const priority = await PriorityService.createPriority({
                title,
                color,
                userId: user.id,
            });
            respond({ res, data: PriorityService.respondWith(priority) });
        }),
        updatePriority: createController(async (req, res) => {
            const user = await UserService.auth(req);
            const { id } = await UpdatePrioritySchemaQuery.validate(req.params).catch(
                mapToResponseError({
                    notifyMessage: 'Could not update priority, invalid data',
                }),
            );
            const { title, color } = await UpdatePrioritySchemaBody.validate(req.body).catch(
                mapToResponseError({
                    notifyMessage: 'Could not update priority, invalid data',
                }),
            );

            if (title) {
                const isUnique = await PriorityService.isTitleUnique(user.id, title);

                if (!isUnique) {
                    throw new ResponseError({ notifyMessage: 'Priority title should be unique' });
                }
            }

            const priority = await PriorityService.updatePriority(user.id, id, (priority) => ({
                ...priority,
                ...cleanObject({
                    title,
                    color,
                }),
            }));

            respond({ res, data: PriorityService.respondWith(priority) });
        }),
        deletePriority: createController(async (req, res) => {
            const user = await UserService.auth(req);
            const { id } = await DeletePrioritySchemaQuery.validate(req.params).catch(
                mapToResponseError({
                    notifyMessage: 'Could not delete priority, invalid data',
                }),
            );

            await PriorityService.deletePriority(user.id, id);
            await TodoService.unlinkPriority(user.id, id);
            respond({ res });
        }),
        getPriorities: createController(async (req, res) => {
            const user = await UserService.auth(req);

            const priorities = await PriorityService.getUserPriorities(user.id);
            const data = priorities
                .map(PriorityService.respondWith)
                .sort((a, b) => a.title.localeCompare(b.title));

            respond({ res, data });
        }),
    }),
);

export { PriorityController };
