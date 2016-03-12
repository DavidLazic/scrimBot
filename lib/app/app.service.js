module.exports = (function() {
    'use strict';

    /**
     * @description
     * Normalize server's port on init.
     *
     * @param  {Integer} | portValue - current process port value.
     * @return {Integer}
     * @public
     */
    function normalizePort (portValue) {
        var port = parseInt(portValue, 10);

        if (isNaN(port)) return portValue;
        if (port >= 0) return port;
        return false;
    }

    /**
     * @description
     * Event listener for HTTP server "error" event.
     *
     * @param  {String} | error  - server error event.
     * @return {String}
     * @public
     */
    function onError (error, port) {
        if (error.syscall !== 'listen') throw error;

        var bind = typeof port === 'string'
          ? 'Pipe ' + port
          : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * @description
     * Event listener for HTTP server "listening" event.
     *
     * @param {Object} | server - current server instance.
     * @return {String}
     * @public
     */
    function onListening (server) {
        var addr = server.address();
        var bind = typeof addr === 'string'
          ? 'pipe ' + addr
          : 'port ' + addr.port;
    }

    /**
     * @description
     * App service API.
     *
     * @public
     */
    return {
        normalizePort: normalizePort,
        onError: onError,
        onListening: onListening
    };
})();