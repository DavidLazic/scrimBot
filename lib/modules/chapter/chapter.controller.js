const ChapterService = require('./chapter.service');
const Chapter = require('./chapter.model');
const CONFIG = require('../../../config');

function onDone (socket) {
    return socket.emit(CONFIG.events.CHAPTER_DOWNLOAD, { ok: true });
}

function onError (socket, error) {
    return socket.emit(CONFIG.events.CHAPTER_DOWNLOAD, { ok: false, error: error.toString() });
}

function resolveNext ({ socket, url, total }) {
    return total > 0
        ? onDownload(socket, { url, total })
        : onDone(socket)
}

async function onDownload (socket, req) {
    onProgress(socket);

    try {
        const isValid = await ChapterService.validate(req.url);
        const page = await ChapterService.getPage(req.url);
        const images = await ChapterService.getImages(page.IMAGES);
        const chapter = await ChapterService.getChapter(page, images);

        return chapter.save()
            .then(() => resolveNext({
                socket,
                url: chapter.next,
                total: req.total - 1
            }))
            .catch(error => onError(socket, error))
    } catch (error) {
        return onError(socket, error);
    }
}

module.exports = (socket, req) => onDownload(socket, req)
