var request = require('request');
var zlib = require('zlib');
var mkdirp = require('mkdirp');
var fs = require('fs');
var debug = require('../debug/debug.js');

module.exports = (function() {
    'use strict';

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
        this.name = '';
        this.src = '';
        this.ext = '';
        this.total = 0;

        return function (_this, str) {
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
     * @public
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
     * @public
     */
    Config.prototype._getSource = function (str) {
        var temp = str.match(/<img\s+[^>]*?src=("|')([^"']+)\1/g)[0];
        return temp.match(/("|')([^"']+)\1/g)[0].replace(/"/g, '');
    };

    /**
     * @description
     * Get image extension.
     *
     * @param  {String} src
     * @return {String}
     * @public
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
     * @public
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
            count: CONFIG.index
        });

        CONFIG.socket.emit('download.success', {message: 'success', files: CONFIG.files, time: new Date()});
        CONFIG.index = 1;
        CONFIG.progress = 0;
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

                return (!!(config.total - CONFIG.index)) ? _onContinue() : _onComplete(config.name);
            });
        });
    }

    /**
     * @description
     * Get image file.
     *
     * @param  {String} body
     * @param  {Object} params
     * @return {Function}
     * @private
     */
    function _getFile (body, params) {
        var config = params || new Config(body.toString());

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
            var config = new Config(unzipped.toString());
            return _getFile(body, config);
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
        socket.on('api.chapter', function (url) {
            debug.log('downloadStart');
            _getPage(url);
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