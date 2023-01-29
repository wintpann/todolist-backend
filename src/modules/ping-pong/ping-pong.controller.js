import { di } from '../../utils/di.js';
import { PingPongService } from './ping-pong.service.js';

const PingPongController = di.record(PingPongService, (PingPongService) => ({
    ping: (req, res) => {
        res.json(PingPongService.ping());
    },
}));

export { PingPongController };
