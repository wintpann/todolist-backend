import * as Yup from 'yup';

const UserSchemaDB = Yup.object().shape({
    id: Yup.string().trim().required(),
    login: Yup.string().trim().required(),
    password: Yup.string().trim().required(),
    refreshToken: Yup.string().nullable(),
    todoIds: Yup.array().of(Yup.string().trim().required()),
    labelIds: Yup.array().of(Yup.string().trim().required()),
    priorityIds: Yup.array().of(Yup.string().trim().required()),
});

const LoginSchemaBody = Yup.object().shape({
    login: Yup.string().trim().required(),
    password: Yup.string().trim().required(),
});

const SignupSchemaBody = Yup.object().shape({
    login: Yup.string().trim().required(),
    password: Yup.string().trim().required(),
});

const AuthSchemaHeader = Yup.string().trim().required();

const RefreshSchemaHeader = Yup.string().trim().required();

export { UserSchemaDB, LoginSchemaBody, SignupSchemaBody, AuthSchemaHeader, RefreshSchemaHeader };
