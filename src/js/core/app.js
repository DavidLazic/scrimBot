;(function ($, io) {
    'use strict';

    /**
     * @description
     * App constructor fn.
     *
     * @public
     */
    function App () {
        this.$window = $(window);
        this.$document = $(document);
        this.io = io();
        this.modules = [];
        this.services = [];
    }

    /**
     * @description
     * Initialize app's components at DOM ready event.
     *
     * @return {Function}
     * @public
     */
    App.prototype.initialize = function () {
        return this
            ._initServices()
            ._initModules();
    };

    /**
     * @description
     * Initialize app modules.
     *
     * @return {Object}
     * @private
     */
    App.prototype._initModules = function () {
        var __super = this;

        this.modules.forEach(function (module) {
            __super[module.annotation] = module.scope.call(__super, null).$get();
            (__super[module.annotation].apply(__super, null)).init();
        });

        return this;
    };

    /**
     * @description
     * Initialize app services.
     *
     * @return {Object}
     * @private
     */
    App.prototype._initServices = function () {
        var __super = this;

        this.services.forEach(function (service) {
            __super[service.annotation] = service.scope.apply(service.scope, null);
        });

        return this;
    };

    /**
     * @description
     * Register app component.
     *
     * @param  {String} type
     * @param  {String} slug
     * @param  {Function} fn
     * @return {Object}
     * @public
     */
    App.prototype.registerComponent = function (type, slug, fn) {
        this[type].push({annotation: slug, scope: fn});
        return this;
    };

    window.App = new App();
})(jQuery, io);

$(function () {
    window.App.initialize();
});
