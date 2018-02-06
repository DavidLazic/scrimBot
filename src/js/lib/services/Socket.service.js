import io from 'socket.io-client';
import { CONSTANTS } from 'lib/utils';

const socket = io('http://localhost:3000');

export default class Socket {

    constructor () {
        this.bind();
    }

    bind () {
        return Object.keys(CONSTANTS.events).forEach(key =>
            socket.on(CONSTANTS.events[key], res => dispatch(CONSTANTS.events[key], res)));
    }

    emit (event, params) {
        return socket.emit(event, params);
    }
};
