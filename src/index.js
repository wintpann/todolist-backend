import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUI from 'swagger-ui-express';
import swaggerDoc from './swagger.json' assert { type: 'json' };
import { resolve } from './utils/dirname.js';
import { initLowDB } from './db/index.js';
import { createRouters } from './modules/routers.js';

dotenv.config({ path: resolve(import.meta.url, '..', '.env') });

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/swagger/json', (req, res) => res.json(swaggerDoc));
app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

const db = await initLowDB();
const Routers = createRouters({ db });

app.use('/api', Routers.PingPongRouter);
app.use('/api', Routers.UserRouter);
app.use('/api', Routers.TodoRouter);
app.use('/api', Routers.CommentRouter);
app.use('/api', Routers.LabelRouter);
app.use('/api', Routers.PriorityRouter);

app.listen(process.env.PORT, () => console.log('BACKEND IS RUNNING ON PORT', process.env.PORT));
