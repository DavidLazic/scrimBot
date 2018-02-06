const ChapterService = require('./chapter.service');
const CONFIG = require('../../../config');

class ChapterController {

    handle (socket, req) {
        const { url, total } = req;

        if (!url || !ChapterService.isValid(url)) {
            socket.emit(CONFIG.events.CHAPTER_DOWNLOAD, { ok: false, error: 'Invalid URL' });
        }

    }
}

module.exports = new ChapterController();
