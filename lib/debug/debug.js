module.exports = (function() {
    'use strict';

    var DEBUG = process.env.DEBUG || false;

    var logger = {

            log: {
                route: function (params) {
                    console.log('Processing route ... ( ' + params.method + ' | ' + params.originalUrl + ' )');
                },
                downloadStart: function (params) {
                    console.log('Download starting ...');
                },
                downloadComplete: function (params) {
                    console.log('Download complete ... ' + params.name + ' [' + params.count + ' files]');
                },
                fileSaved: function (params) {
                    console.log('[' + params.time + ']', '... ( ' + params.name + ' saved )');
                }
            },

            error: {
                route: function (params) {
                    console.log({
                        module: 'App --> ' + params.method,
                        error: params.error,
                        message: 'No matching route.'
                    })
                }
            }
        };

    /**
     * @description
     * Log events.
     *
     * @param  {String} type
     * @param  {Object} params
     * @return {Object}
     * @public
     */
    function log (type, params) {
        if (logger.log[type]) {
            return logger.log[type](params);
        }
    }

    /**
     * @description
     * Log errors.
     *
     * @param  {String} type
     * @param  {Object} params
     * @return {Object}
     * @public
     */
    function error (type, params) {
        if (!DEBUG) {
            console.log('Server is currently in silent mode.')
            console.log('To enable debug mode start server with \'npm run start:debug\'');
        }
        if (DEBUG && logger.error[type]) {
            return logger.error[type](params);
        }
    }

    /**
     * @description
     * Debug module API.
     *
     * @public
     */
    return {
        log: log,
        error: error
    };
})();