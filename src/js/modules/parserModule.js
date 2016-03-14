;(function ($, app) {
    'use strict';

    // Parser config and DOM bindings
    var PARSER_CFG = {
            url: $('.js-io'),
            btn: $('.js-dl'),
            total: $('.js-total'),
            progress: $('.js-progress')
        };

    /**
     * @description
     * Parser module constructor fn.
     *
     * @param {Object} app
     * @return {Object}
     * @public
     */
    function ParserModule (app) {

        var __super = this;
        var SocketService = __super['service.socket'] || {};

        /**
         * @description
         * Parser constructor fn.
         *
         * @param {Object} params
         * @public
         */
        function Parser (params) {
            this.url = '';
            this.total = 0;
            this.el = {
                btn: params.btn || null,
                url: params.url || null,
                total: params.total || null,
                progress: params.progress || null
            };
        }

        /**
         * @description
         * Init fn.
         *
         * @return {Object}
         * @public
         */
        Parser.prototype.init = function () {
            this
                ._bindSocketListeners()
                ._bindEvents();

            return this;
        };

        /**
         * @description
         * Bind socket listeners.
         *
         * @return void
         * @private
         */
        Parser.prototype._bindSocketListeners = function () {
            var _this = this;

            SocketService.listen('download.progress', _this._onProgress.bind(_this));
            SocketService.listen('download.success', _this._onSuccess.bind(_this));
            SocketService.listen('download.error', _this._onError.bind(_this));

            return this;
        };

        /**
         * @description
         * Bind DOM events.
         *
         * @return {Object}
         * @private
         */
        Parser.prototype._bindEvents = function () {
            var _this = this;

            __super.$document.on('click', '.js-dl', _this._dlRequest.bind(_this));
            __super.$document.on('change', '.loader__input', function () {
                _this._onChange.call(_this, $(this));
            });

            return this;
        };

        /**
         * @description
         * On download error fn.
         *
         * @param  {Object} response
         * @return {Function}
         * @private
         */
        Parser.prototype._onError = function (response) {
            this._resetLoader();
        };

        /**
         * @description
         * On download progress fn.
         *
         * @param  {Object} response
         * @return {Function}
         * @private
         */
        Parser.prototype._onProgress = function (response) {
            this.el.progress.css('width', response + '%');
        };

        /**
         * @description
         * On download success fn.
         *
         * @param  {Object} response
         * @return {Function}
         * @private
         */
        Parser.prototype._onSuccess = function (response) {
            this._resetLoader();
        };

        /**
         * @description
         * On input change.
         *
         * @param  {Object} ctx
         * @return {Function}
         * @private
         */
        Parser.prototype._onChange = function (ctx) {
            var _this = this;
            var value = ctx.val();


            (ctx.data('url')) ? _this._setUrl.call(_this, value) : _this._setTotal.call(_this, value);
            return (!!value) ? ctx.addClass('filled') : ctx.removeClass('filled');
        };

        /**
         * @description
         * Reset loader button.
         *
         * @return {Object}
         * @private
         */
        Parser.prototype._resetLoader = function () {
            this.el.progress.css('width', '0%');
            this.el.btn.prop('disabled', false);
            return this;
        };

        /**
         * @description
         * Update parser's URL.
         *
         * @param {String} url
         * @private
         */
        Parser.prototype._setUrl = function (url) {
            this.url = url;
        };

        /**
         * @description
         * Update parser's total count.
         *
         * @param {Integer} total
         * @private
         */
        Parser.prototype._setTotal = function (total) {
            this.total = (total.match(/^\d+$/)) ? total : 1;
        };

        /**
         * @description
         * Send socket request.
         *
         * @return {Function}
         * @private
         */
        Parser.prototype._dlRequest = function () {
            this.el.btn.prop('disabled', true);
            return this.url && SocketService.broadcast('api.chapter', {url: this.url, total: this.total});
        };

        /**
         * @description
         * Parser module's init fn.
         *
         * @return {Object}
         * @public
         */
        function init () {
            var parser = new Parser(PARSER_CFG);

            return function () {
                return parser;
            };
        }

        /**
         * @description
         * Parser module API.
         *
         * @return {Object}
         * @public
         */
        return {
            $get: init
        };
    }

    app.registerComponent('modules', 'module.parser', ParserModule);

})(jQuery, window.App);
