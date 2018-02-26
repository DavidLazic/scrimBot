const Chapter = require('./chapter.model');
const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = {

    /**
     * @description
     * Check if input URL is valid
     *
     * @param {String} url
     * @return {Promise<Bool>}
     * @public
     */
    validate: url =>
        new Promise((resolve, reject) =>
            Boolean(Chapter.isValid(url)) ? resolve() : reject('Invalid URL')),

    /**
     * @description
     * Get single page and transform response to a DOM object
     * from which we extract page's title, next chapter's URL and
     * all the images' URLs
     *
     * @param {String} url
     * @return {Promise<Object>}
     * @public
     */
    getPage: url => new Promise((resolve, reject) => {
        fetch(url)
            .then(res => res.text())
            .then(body => {
                const { document } = (new JSDOM(body)).window;;
                const title = document.querySelector('option[selected]').textContent;
                const fullName = url.match(/chapter\/(.*)\//)[1];
                const volumeNo = title.match(/\d+/g)[0];
                const chapterNo = title.match(/\d+/g)[1];

                return resolve({
                    name: `${fullName}_v${volumeNo}_c${chapterNo}`,
                    next: document.querySelectorAll('.btn_theodoi')[1].href,
                    IMAGES: [...document.querySelector('.vung_doc').querySelectorAll('img')]
                });
            })
            .catch(err => reject(err))
    }),

    /**
     * @description
     * Fetch single images and map image fetch promises
     *
     * @param {Array} images
     * @return {Array}
     * @public
     */
    getImages: images => new Promise((resolve, reject) => {
        Promise.all(images.map((image, index) =>
            fetch(image.src)
                .then(res => res.buffer())
                .then(buffer => ({
                    src: image.src,
                    buffer,
                    ext: image.src.split('.')[3],
                    idx: index + 1
                }))
                .catch(err => reject(err))))
            .then(res => resolve(res))
    }),

    /**
     * @description
     * Get all images from the page and create new Chapter class
     *
     * @param {Object} page
     * @return {Promise<Object>}
     * @public
     */
    getChapter: (page, images) => Promise.resolve(
        new Chapter({
            name: page.name,
            next: page.next,
            data: images,
            total: images.length
        }))
};
