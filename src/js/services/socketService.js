;(function ($, app) {
    'use strict';

    /**
     * @description
     * Socket service constructor fn.
     *
     * @return {Object}
     * @public
     */
    function SocketService () {

        /**
         * @description
         * Listen for event fn.
         *
         * @param  {String} event
         * @param  {Function} cb
         * @return {Function}
         * @public
         */
        function listenEvent (event, cb) {
            return app.io.on(event, cb);
        }

        /**
         * @description
         * Broadcast event fn.
         *
         * @param  {String} event
         * @param  {Object} params
         * @return {Function}
         * @public
         */
        function broadcastEvent (event, params) {
            return app.io.emit(event, params);
        }

        /**
         * @description
         * Socket service API.
         *
         * @return {Object}
         * @public
         */
        return {
            listen: listenEvent,
            broadcast: broadcastEvent
        };
    }

    app.registerComponent('services', 'service.socket', SocketService);
})(jQuery, window.App);