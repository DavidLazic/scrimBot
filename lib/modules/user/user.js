var debug = require('../../debug/debug.js');
var UserController = require('./controller/user.controller.js');

module.exports = (function() {
	'use strict';

	/**
	 * @description
	 * Init fn.
	 *
	 * @param  {Object} router - express router.
	 * @return {Function}
	 * @public
	 */
	function init (router) {

		// user CRUD route
		router.route('/user/:email')
			.get(function (req, res) {
				UserController.read(req, res);
			})
			.post(function (req, res) {
				UserController.create(req, res);
			})
			.put(function (req, res) {
				UserController.update(req, res);
			})
			.delete(function (req, res) {
				UserController.delete(req, res);
			});

		// refresh user session
		router.route('/user/ping/:id')
			.get(function (req, res) {
				UserController.ping(req, res);
			});

		// all users route
		router.route('/user')
			.get(function (req, res) {
				UserController.readAll(req, res);
			});
	}

	/**
	 * @description
	 * User routes module API
	 *
	 * @public
	 */
	return {
		init: init
	};
})();