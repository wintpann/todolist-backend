import { di } from '../../utils/di.js';
import {
    createController,
    mapToResponseError,
    respond,
    ResponseError,
} from '../../utils/response.js';
import { LabelService } from './label.service.js';
import { UserService } from '../user/user.service.js';
import { TodoService } from '../todo/todo.service.js';
import {
    CreateLabelSchemaBody,
    DeleteLabelSchemaQuery,
    UpdateLabelSchemaBody,
    UpdateLabelSchemaQuery,
} from './label.schema.js';

const LabelController = di.record(
    LabelService,
    UserService,
    TodoService,
    (LabelService, UserService, TodoService) => ({
        createLabel: createController(async (req, res) => {
            const user = await UserService.auth(req);

            const { title } = await CreateLabelSchemaBody.validate(req.body).catch(
                mapToResponseError({ notifyMessage: 'Could not create label, invalid data' }),
            );
            const isUnique = await LabelService.isTitleUnique(user.id, title);

            if (!isUnique) {
                throw new ResponseError({ notifyMessage: 'Label title should be unique' });
            }

            const label = await LabelService.createLabel(title, user.id);
            respond({ res, data: LabelService.respondWith(label) });
        }),
        updateLabel: createController(async (req, res) => {
            const user = await UserService.auth(req);

            const { id } = await UpdateLabelSchemaQuery.validate(req.params).catch(
                mapToResponseError({ notifyMessage: 'Could not update label, invalid data' }),
            );
            const { title } = await UpdateLabelSchemaBody.validate(req.body).catch(
                mapToResponseError({ notifyMessage: 'Could not update label, invalid data' }),
            );

            const isUnique = await LabelService.isTitleUnique(user.id, title);

            if (!isUnique) {
                throw new ResponseError({ notifyMessage: 'Label title should be unique' });
            }

            const label = await LabelService.updateLabel(user.id, id, (label) => ({
                ...label,
                title,
            }));
            respond({ res, data: LabelService.respondWith(label) });
        }),
        deleteLabel: createController(async (req, res) => {
            const user = await UserService.auth(req);

            const { id } = await DeleteLabelSchemaQuery.validate(req.params).catch(
                mapToResponseError({ notifyMessage: 'Could not delete label, invalid data' }),
            );

            await LabelService.deleteLabel(user.id, id);
            await TodoService.unlinkLabel(user.id, id);
            respond({ res });
        }),
        getLabels: createController(async (req, res) => {
            const user = await UserService.auth(req);

            const labels = await LabelService.getUserLabels(user.id);
            const data = labels
                .map(LabelService.respondWith)
                .sort((a, b) => a.title.localeCompare(b.title));

            respond({ res, data });
        }),
    }),
);

export { LabelController };
