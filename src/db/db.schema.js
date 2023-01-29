import * as Yup from 'yup';
import { CommentSchemaDB } from '../modules/comment/comment.schema.js';
import { TodoSchemaDB } from '../modules/todo/todo.schema.js';
import { UserSchemaDB } from '../modules/user/user.schema.js';
import { LabelSchemaDB } from '../modules/label/label.schema.js';
import { PrioritySchemaDB } from '../modules/priority/priority.schema.js';

const DBSchema = Yup.object().shape({
    comments: Yup.array().of(CommentSchemaDB).required(),
    labels: Yup.array().of(LabelSchemaDB).required(),
    priorities: Yup.array().of(PrioritySchemaDB).required(),
    todos: Yup.array().of(TodoSchemaDB).required(),
    users: Yup.array().of(UserSchemaDB).required(),
});

export { DBSchema };
