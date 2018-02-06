const io = require('socket.io');
let IO;

module.exports = {
    connect: server => new Promise((resolve, reject) => {
        IO = io(server);
        return resolve(IO);
    }),
    get: () => {
        if (!IO) throw new Error('[Error] ... No socket connection');
        return IO;
    }
};
