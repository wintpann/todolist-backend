import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import pick from 'lodash/pick.js';
import { di } from '../../utils/di.js';
import { findByPredicate } from '../../utils/common.js';
import { mapToResponseError, RESPONSE, ResponseError } from '../../utils/response.js';
import { AuthSchemaHeader, RefreshSchemaHeader } from './user.schema.js';

const UserService = di.record(di.key()('db'), (db) => {
    const createTokens = (user) => {
        const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        const refreshToken = uuid();

        return { accessToken, refreshToken };
    };

    const getBy = async (userLike) => {
        return findByPredicate(
            db.data.users,
            (user) =>
                user.id === userLike.id ||
                user.login === userLike.login ||
                user.refreshToken === userLike.refreshToken,
        );
    };

    const createUser = async (userData) => {
        const [sameUser] = await getBy({ login: userData.login });

        if (sameUser) {
            throw new ResponseError({ notifyMessage: 'User with this login already exists' });
        }

        const password = await bcrypt.hash(userData.password, 12);

        const user = {
            id: uuid(),
            login: userData.login,
            password,
            refreshToken: '',
            todoIds: [],
            labelIds: [],
            priorityIds: [],
        };

        db.data.users.push(user);
        db.update();

        return user;
    };

    const updateUser = async (userLike, callback) => {
        const [user, index] = await getBy(userLike);

        if (!user) {
            throw new ResponseError({ notifyMessage: 'No user was found' });
        }

        const updated = { ...user, ...callback(user) };
        db.data.users[index] = updated;

        db.update();
        return updated;
    };

    const validatePassword = async (user, password) => {
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            throw new ResponseError({ notifyMessage: 'Incorrect password' });
        }
    };

    const auth = async (req) => {
        const access_token = await AuthSchemaHeader.validate(req.headers.access_token).catch(
            mapToResponseError({ response: RESPONSE.AUTH_REQUIRED }),
        );

        const payload = jwt.decode(access_token, process.env.JWT_SECRET);

        if (!payload) {
            throw new ResponseError({
                response: RESPONSE.AUTH_REQUIRED,
                message: 'AuthorizationTokenInvalid',
            });
        }

        try {
            jwt.verify(access_token, process.env.JWT_SECRET);
        } catch (e) {
            if (e instanceof jwt.TokenExpiredError) {
                throw new ResponseError({
                    message: 'AuthorizationTokenExpired',
                    response: RESPONSE.AUTH_REQUIRED,
                });
            } else {
                throw new ResponseError({
                    message: 'AuthorizationTokenInvalid',
                    response: RESPONSE.AUTH_REQUIRED,
                });
            }
        }

        const [user] = await getBy({ id: payload.userId });
        if (!user)
            throw new ResponseError({ message: 'NoUserFound', response: RESPONSE.AUTH_REQUIRED });

        return user;
    };

    const refresh = async (req) => {
        const refreshToken = await RefreshSchemaHeader.validate(req.headers.refresh_token).catch(
            mapToResponseError({ response: RESPONSE.AUTH_REQUIRED }),
        );

        const [user] = await getBy({ refreshToken });
        if (!user) {
            throw new ResponseError({ message: 'NoUserFound', response: RESPONSE.AUTH_REQUIRED });
        }

        const { accessToken, refreshToken: newRefreshToken } = createTokens(user);
        await updateUser(user, (user) => ({ ...user, refreshToken: newRefreshToken }));

        return { user, accessToken, refreshToken: newRefreshToken };
    };

    const respondWith = (user) => pick(user, ['id', 'login']);

    return {
        createTokens,
        getBy,
        updateUser,
        createUser,
        validatePassword,
        auth,
        refresh,
        respondWith,
    };
});

export { UserService };
