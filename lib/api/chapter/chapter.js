var request = require('request');
var zlib = require('zlib');
var mkdirp = require('mkdirp');
var fs = require('fs');
var validUrl = require('valid-url');
var debug = require('../../debug/debug');

module.exports = (function() {
    'use strict';

    // Current chapter index
    var CHAPTER_IDX = 1;
    // Total number of chapters to download
    var DL_TOTAL = 1;
    // Chapter API semi-global config
    var CONFIG = {
            req: {},
            socket: {},
            dir: 'dist',
            index: 1,
            files: [],
            progress: 0
        };

    /**
     * @description
     * Config constructor fn.
     *
     * @param {String} str
     * @return {Function}
     * @public
     */
    function Config (str) {
        this.next = 0;
        this.name = '';
        this.src = '';
        this.ext = '';
        this.total = 0;

        return function (_this, str) {
            _this.next = _this._getNextChapter();
            _this.name = _this._getName(str);
            _this.src = _this._getSource(str);
            _this.ext = _this._getExtension(_this.src);
            _this.total = _this._getTotal(str);
        }(this, str);
    }

    /**
     * @description
     * Get file name.
     *
     * @param  {String} str
     * @return {String}
     * @private
     */
    Config.prototype._getName = function (str) {
        var temp = str.match(/\/manga\/.+?(?=\/"\sid="comments")/)[0].split('/');
        return temp.slice(2, temp.length).join('_');
    };

    /**
     * @description
     * Get image source.
     *
     * @param  {String} str
     * @return {String}
     * @private
     */
    Config.prototype._getSource = function (str) {
        var temp = str.match(/<img\s+[^>]*?src=("|')([^"']+)\1/g)[0];
        return temp.match(/("|')([^"']+)\1/g)[0].replace(/"/g, '');
    };

    /**
     * @description
     * Get next chapter base url.
     *
     * @return {String}
     * @private
     */
    Config.prototype._getNextChapter = function () {
        var current = CONFIG.req.match(/(\/c(\d+[^\/{1}]))/)[2];
        return  CONFIG.req.replace(new RegExp('(\/c(' + current + '))'), '/c0' + (parseInt(current, 10) + 1));
    };

    /**
     * @description
     * Get image extension.
     *
     * @param  {String} src
     * @return {String}
     * @private
     */
    Config.prototype._getExtension = function (src) {
        var temp = src.split('.');
        return temp[temp.length - 1];
    };

    /**
     * @description
     * Get total number of images in chapter.
     *
     * @param  {String} str
     * @return {Integer}
     * @private
     */
    Config.prototype._getTotal = function (str) {
        var duplicates = 2;
        var comments = 1;
        return (str.match(/(<option\s)+/g)).length / duplicates - comments;
    };

    /**
     * @description
     * On download complete.
     *
     * @param  {String} name
     * @return {Object}
     * @private
     */
    function _onComplete (name) {
        debug.log('downloadComplete', {
            name: name,
            count: CONFIG.files.length
        });

        CONFIG.socket.emit('download.success', {message: 'success', files: CONFIG.files, time: new Date()});
        CHAPTER_IDX = 1;
        DL_TOTAL = 1;
        _onReset();
    }

    /**
     * @description
     * On next chapter fn.
     *
     * @param  {Object} params
     * @return {Function}
     * @private
     */
    function _onNextChapter (params) {
        if (CHAPTER_IDX < DL_TOTAL) {
            _getPage(params.next.replace(new RegExp(CONFIG.index + '\\.html'), '1.html'));
            _onReset();
            CHAPTER_IDX++;
        } else {
            return _onComplete(params.name);
        }
    }

    /**
     * @description
     * On continue download.
     *
     * @return {Function}
     * @private
     */
    function _onContinue () {
        return _getPage(CONFIG.req.replace(new RegExp(CONFIG.index + '\\.html'), ++CONFIG.index + '.html'));
    }

    /**
     * @description
     * On reset fn.
     *
     * @return void
     * @private
     */
    function _onReset () {
        CONFIG.index = 1;
        CONFIG.progress = 0;
    }

    /**
     * @description
     * Make directory and write file.
     *
     * @param  {String} body
     * @param  {Object} config
     * @return {Function}
     * @private
     */
    function _writeFile (body, config) {
        var dir = CONFIG.dir + '/' + config.name
        var fileName = config.name + '_' + CONFIG.index + '.' + config.ext;

        mkdirp(dir, function (err) {
            if (err) throw err;

            fs.writeFile(dir + '/' + fileName, body, 'binary', function (err) {
                if (err) throw err;

                debug.log('fileSaved', {
                    time: new Date(),
                    name: fileName
                });

                CONFIG.files.push(fileName);
                CONFIG.progress = parseInt(CONFIG.index * (100 / config.total), 10);

                return (!!(config.total - CONFIG.index)) ? _onContinue() : _onNextChapter(config);
            });
        });
    }

    /**
     * @description
     * Get image file.
     *
     * @param  {String} body
     * @return {Function}
     * @private
     */
    function _getFile (body) {
        var config = new Config(body.toString());

        request.get({
            url: config.src,
            encoding: 'binary'
        }, function (err, response, body) {
            if (err) throw err;

            return _writeFile(body, config);
        });
    }

    /**
     * @description
     * Unzip response.
     *
     * @param  {String} body
     * @return {Function}
     * @private
     */
    function _unzip (body) {
        zlib.gunzip(body, function (err, unzipped) {
            return _getFile(unzipped);
        });
    }

    /**
     * @description
     * Get page by URL.
     *
     * @param  {String} url
     * @return {Function|Object}
     * @private
     */
    function _getPage (url) {
        CONFIG.req = url;

        request.get({
            url: url,
            encoding: null
        }, function (err, response, body) {
            if (err) throw err;

            CONFIG.socket.emit('download.progress', CONFIG.progress);
            return (response.headers['content-encoding'] === 'gzip') ? _unzip(body) : _getFile(body);
        });
    }

    /**
     * @description
     * Init fn.
     *
     * @param  {Object} socket
     * @return void
     * @public
     */
    function init (socket) {
        CONFIG.socket = socket;

        socket.on('api.chapter', function (params) {

            if (params.url && validUrl.isUri(params.url)) {
                debug.log('downloadStart');
                DL_TOTAL = params.total || 1;
                _getPage(params.url);
            } else {
                CONFIG.socket.emit('download.error', {message: 'Invalid URL.'});
            }
        });

        socket.on('error', function (err) {
            CONFIG.socket.emit('download.error', err);
        });
    }

    /**
     * @description
     * API routes.
     *
     * @public
     */
    return {
        init: init
    };
})();