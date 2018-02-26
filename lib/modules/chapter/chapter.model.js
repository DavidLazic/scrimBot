const validUrl = require('valid-url');
const mkdirp = require('mkdirp');
const fs = require('fs');
const CONFIG = require('../../../config');

class Chapter {

    /**
     * @param {String} url
     * @return {Bool}
     */
    static isValid (url) {
        return validUrl.isHttpUri(url);
    }

    /**
     * @param {Object} options
     *
     * @prop {Array}  data
     * @prop {String} name
     * @prop {String} next
     * @prop {Number} total
     */
    constructor (options) {
        this.data = [];
        this.name = '';
        this.next = '';
        this.total = 0;

        Object.assign(this, options);
    }

    save (cb) {
        const dir = `${CONFIG.export.ROOT}/${this.name}`;

        return new Promise((resolve, reject) =>
            mkdirp(dir, err => err
                ? reject(err)
                : (
                    this.data.forEach((item, index) => {
                        const fileName = `${this.name}_${item.idx}.${item.ext}`;

                        fs.writeFile(`${dir}/${fileName}`, item.buffer, 'binary', err => err ? reject(err) : cb(item.idx));
                    }), resolve()
                )
            )
        );
    }
}

module.exports = Chapter;
