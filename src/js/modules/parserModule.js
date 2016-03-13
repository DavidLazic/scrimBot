;(function ($, app) {
    'use strict';

    // Parser config and DOM bindings
    var PARSER_CFG = {
            input: $('.js-io'),
            btn: $('.js-dl'),
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
            this.el = {
                btn: params.btn || null,
                input: params.input || null,
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

            this.el.input.on('change', function () {
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

            _this._setUrl.call(_this, value);
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
         * Send socket request.
         *
         * @return {Function}
         * @private
         */
        Parser.prototype._dlRequest = function () {
            this.el.btn.prop('disabled', true);
            return this.url && SocketService.broadcast('api.chapter', this.url);
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
