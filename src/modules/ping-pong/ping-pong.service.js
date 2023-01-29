import { di } from '../../utils/di.js';

const PingPongService = di.record(() => ({
    ping: () => ({ data: 'pong' }),
}));

export { PingPongService };
