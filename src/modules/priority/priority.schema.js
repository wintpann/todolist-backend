import * as Yup from 'yup';

const PrioritySchemaDB = Yup.object().shape({
    id: Yup.string().trim().required(),
    userId: Yup.string().trim().required(),
    color: Yup.string().trim().required(),
    title: Yup.string().trim().required(),
});

const CreatePrioritySchemaBody = Yup.object().shape({
    title: Yup.string().trim().required(),
    color: Yup.string().trim().required(),
});

const UpdatePrioritySchemaBody = Yup.object().shape({
    title: Yup.string().trim().min(1),
    color: Yup.string().trim().min(1),
});

const UpdatePrioritySchemaQuery = Yup.object().shape({
    id: Yup.string().trim().required(),
});

const DeletePrioritySchemaQuery = Yup.object().shape({
    id: Yup.string().trim().required(),
});

export {
    PrioritySchemaDB,
    CreatePrioritySchemaBody,
    UpdatePrioritySchemaBody,
    UpdatePrioritySchemaQuery,
    DeletePrioritySchemaQuery,
};
