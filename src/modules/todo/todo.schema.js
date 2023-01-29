import * as Yup from 'yup';

const TodoSchemaDB = Yup.object().shape({
    id: Yup.string().trim().required(),
    userId: Yup.string().trim().required(),
    title: Yup.string().trim().required(),
    description: Yup.string().nullable(),
    checked: Yup.boolean().required(),
    commentIds: Yup.array().of(Yup.string().trim().required()),
    labelIds: Yup.array().of(Yup.string().trim().required()),
    priorityId: Yup.string().nullable(),
    dueDateISO: Yup.date().nullable(),
});

const CreateTodoSchemaBody = Yup.object().shape({
    title: Yup.string().trim().required(),
    description: Yup.string().trim().nullable(),
    labelIds: Yup.array().of(Yup.string().trim().required()),
    priorityId: Yup.string().trim().nullable(),
    dueDateISO: Yup.date().nullable(),
});

const UpdateTodoSchemaBody = Yup.object().shape({
    title: Yup.string().trim().min(1),
    description: Yup.string().trim().min(1).nullable(),
    checked: Yup.boolean(),
    labelIds: Yup.array().of(Yup.string().trim().required()),
    priorityId: Yup.string().trim().nullable(),
    dueDateISO: Yup.date().nullable(),
});

const UpdateTodoSchemaQuery = Yup.object().shape({
    id: Yup.string().trim().required(),
});

const DeleteTodoSchemaQuery = Yup.object().shape({
    id: Yup.string().trim().required(),
});

const GetTodoSchemaQuery = Yup.object().shape({
    id: Yup.string().trim().required(),
});

const GetTodosSchemaQuery = Yup.object().shape({
    checked: Yup.boolean(),
    labelIds: Yup.array().of(Yup.string().trim().required()),
    priorityIds: Yup.array().of(Yup.string().trim().required()),
    fromDueDate: Yup.date().nullable(),
    toDueDate: Yup.date().nullable(),
});

export {
    TodoSchemaDB,
    CreateTodoSchemaBody,
    UpdateTodoSchemaBody,
    UpdateTodoSchemaQuery,
    DeleteTodoSchemaQuery,
    GetTodosSchemaQuery,
};
