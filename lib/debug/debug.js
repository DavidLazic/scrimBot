module.exports = (function() {
	'use strict';

	var DEBUG = process.env.DEBUG || false;

	var logger = {

			log: {
				database: function (params) {
					console.log ('DB - Connected to ' + params.database);
				},

				route: function (params) {
					console.log('Processing route ... ( ' + params.method + ' | ' + params.originalUrl + ' )');
				}
			},

			error: {
				route: function (params) {
					console.log({
						module: 'App --> ' + params.method,
						error: params.error,
						message: 'No matching route.'
					})
				},

				service: function (params) {
					console.log({
						module: 'UserService --> ' + params.method,
						error: params.error
					});
				}
			}
		};

	/**
	 * @description
	 * Log events.
	 *
	 * @param  {String} type - module type.
	 * @param  {Object} params - current request object.
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
	 * @param  {String} type - module type.
	 * @param  {Object} params - current error and message.
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