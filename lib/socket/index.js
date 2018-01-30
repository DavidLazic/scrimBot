const io = require('socket.io');
let socket;

module.exports = {
    connect: server => new Promise((resolve, reject) => {
        socket = io(server);
        return resolve(socket);
    }),
    get: () => {
        if (!socket) throw new Error('[Error] ... No socket connection');
        return socket;
    }
};
