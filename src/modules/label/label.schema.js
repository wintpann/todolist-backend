import * as Yup from 'yup';

const LabelSchemaDB = Yup.object().shape({
    id: Yup.string().trim().required(),
    userId: Yup.string().trim().required(),
    title: Yup.string().trim().required(),
});

const CreateLabelSchemaBody = Yup.object().shape({
    title: Yup.string().trim().required(),
});

const UpdateLabelSchemaBody = Yup.object().shape({
    title: Yup.string().trim().required(),
});

const UpdateLabelSchemaQuery = Yup.object().shape({
    id: Yup.string().trim().required(),
});

const DeleteLabelSchemaQuery = Yup.object().shape({
    id: Yup.string().trim().required(),
});

export {
    LabelSchemaDB,
    CreateLabelSchemaBody,
    UpdateLabelSchemaBody,
    UpdateLabelSchemaQuery,
    DeleteLabelSchemaQuery,
};
