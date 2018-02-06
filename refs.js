const CONFIG = require('./config');
const {
    ChapterController
} = require('./lib/modules');

module.exports = io => {
    io.on('connection', socket => {
        console.log('Socket connected');

        socket.on(CONFIG.events.CHAPTER_DOWNLOAD, req => ChapterController.handle(socket, req));
    });

    io.on('error', error =>
        io.sockets.emit('error', { ok: false, error }));
};
