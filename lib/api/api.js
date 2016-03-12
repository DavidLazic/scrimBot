var request = require('request');
var zlib = require('zlib');
var mkdirp = require('mkdirp');
var fs = require('fs');

module.exports = (function() {
    'use strict';

    var CONFIG = {
            req: {},
            res: {},
            dir: 'dist',
            index: 1,
            files: []
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
     * Make directory and write file.
     *
     * @param  {String} body
     * @param  {Object} config
     * @return {Object}
     * @private
     */
    function _writeFile (body, config) {
        var dir = CONFIG.dir + '/' + config.name
        var fileName = config.name + '_' + CONFIG.index + '.' + config.ext;

        mkdirp(dir, function (err) {
            if (err) throw err;

            fs.writeFile(dir + '/' + fileName, body, 'binary', function (err) {
                if (err) throw err;

                console.log('[' + new Date() + ']', '-- ' + fileName + ' saved.');

                CONFIG.files.push(fileName);

                if (!!(config.total - CONFIG.index)) {
                    _getPage(CONFIG.req.replace(new RegExp(CONFIG.index + '\\.html'), ++CONFIG.index + '.html'));
                } else {
                    CONFIG.index = 1;
                    console.log('Finished downloading.');
                    CONFIG.res.json({message: 'success', files: CONFIG.files, time: new Date()});
                }
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

            var zipped = response.headers['content-encoding'] === 'gzip';

            return (zipped) ? _unzip(body) : _getFile(body);
        });
    }

    /**
     * @description
     * Init fn.
     *
     * @param  {Object} router
     * @return void
     * @public
     */
    function init (router) {

        router.route('/api/get')
            .get(function (req, res) {
                var url = 'http://mangafox.me/manga/king_of_hell/v01/c001/1.html';

                CONFIG.res = res;
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