(function ($document) {
    'use strict';

    /**
     * @description
     * App constructor fn.
     *
     * @param {Object} params
     * @public
     */
    function App (params) {
        this.url = '';
        this.socket = params.socket || null;
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
     * @return void
     * @public
     */
    App.prototype.init = function () {
        this._bindSockets();
        this._bindEvents();
    };

    /**
     * @description
     * Bind socket listeners.
     *
     * @return void
     * @private
     */
    App.prototype._bindSockets = function () {
        var __super = this;

        this.socket.on('download.progress', function (res) {
            __super.el.progress.css('width', res + '%');
        });

        this.socket.on('download.success', function (res) {
            __super.el.progress.css('width', '0%');
            __super.el.btn.prop('disabled', false);
        });
    };

    /**
     * @description
     * Bind DOM events.
     *
     * @return void
     * @private
     */
    App.prototype._bindEvents = function () {
        var __super = this;

        $document.on('click', '.js-dl', __super._dlRequest.bind(__super));

        this.el.input.on('change', function () {
            __super._onChange.call(__super, $(this));
        });
    };

    /**
     * @description
     * On input change.
     *
     * @param  {Object} ctx
     * @return {Function}
     * @private
     */
    App.prototype._onChange = function (ctx) {
        var __super = this;
        var value = ctx.val();

        __super._setUrl.call(__super, value);
        return (!!value) ? ctx.addClass('filled') : ctx.removeClass('filled');
    };

    /**
     * @description
     * Update App's URL.
     *
     * @param {String} url
     * @private
     */
    App.prototype._setUrl = function (url) {
        this.url = url;
    };

    /**
     * @description
     * Send socket request.
     *
     * @return {Function}
     * @private
     */
    App.prototype._dlRequest = function () {
        this.el.btn.prop('disabled', true);
        return this.url && this.socket.emit('api.chapter', this.url);
    };

    window.App = App;
})($(document));


$(function () {
    (new App({
        input: $('.js-io'),
        btn: $('.js-dl'),
        progress: $('.js-progress'),
        socket: io()
    })).init();
});


