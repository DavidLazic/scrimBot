var debug = require('../../../debug/debug.js');
var User = require('../model/user.model.js').get();

module.exports = (function() {
	'use strict';

	// response message
	var message = {
			success: true,
			data: null
		};

	/**
	 * @description
	 * Get message body.
	 *
	 * @return {Object}
	 * @private
	 */
	function _getMessageBody () {
		return JSON.parse(JSON.stringify(message));
	}

	/**
	 * @description
	 * Check if user is existent and create one.
	 *
	 * @param  {Object} req - current client request.
	 * @param  {Function} cb - callback function.
	 * @return {Object}
	 * @public
	 */
	function createUser (req, cb) {
		req.body.email = req.params.email;
		var user = new User(req.body);
		var response = _getMessageBody();

		User.findOne({email: user.email}, function (err, userExists) {
			if (err) {
				return debug.error('service', {
					method: 'createUser',
					error: err
				});
			}

			if (userExists) {
				response.success = false;
				response.data = 'User already exists.'
				return cb(response);
			}

			user.save(function (err) {
				if (err) {
					return debug.error('service', {
						method: 'createUser',
						error: err
					});
				}

				return getUserByEmail(req, cb);
			});
		});
	}

	/**
	 * @description
	 * Get all users.
	 *
	 * @param  {Function} cb - callback function.
	 * @return {Object}
	 * @public
	 */
	function getAllUsers (cb) {
		var response = _getMessageBody();
		User.find({}).exec(function (err, users) {
			if (err) {
				return debug.error('service', {
					method: 'getAllUsers',
					error: err
				});
			}

			if (!users) {
				response.success = false;
			}

			response.data = users;
			return cb(response);
		});
	}

	/**
	 * @description
	 * Get user by email.
	 *
	 * @param  {Object} req - current client request.
	 * @param  {Function} cb - callback function.
	 * @return {Object}
	 * @public
	 */
	function getUserByEmail (req, cb) {
		var response = _getMessageBody();
		User.findOne({email: req.params.email}, function (err, user) {
			if (err) {
				return debug.error('service', {
					method: 'getUserByEmail',
					error: err
				});
			}

			if (!user) {
				response.success = false;
			}

			response.data = user;
			return cb(response);
		});
	}

	/**
	 * @description
	 * Get user by id.
	 *
	 * @param  {Object} req  - current client request.
	 * @param  {Function} cb - callback function.
	 * @return {Object}
	 * @public
	 */
	function getUserById (req, cb) {
		var response = _getMessageBody();
		User.findOne({_id: req.params.id}, function (err, user) {
			if (err) {
				return debug.error('service', {
					method: 'getUserById',
					error: err
				});
			}

			if (!user) {
				response.success = false;
			}

			response.data = user;
			return cb(response);
		});
	}

	/**
	 * @description
	 * Update user by email.
	 *
	 * @param  {Object} req - current client request.
	 * @param  {Function} cb - callback function.
	 * @return {Object}
	 * @public
	 */
	function updateUser (req, cb) {
		var response = _getMessageBody();
		User.findOneAndUpdate({email: req.params.email}, req.body, function (err) {
			if (err) {
				return debug.error('service', {
					method: 'updateUser',
					error: err
				});
			}

			response.data = 'Updated user.';
			return cb(response);
		});
	}

	/**
	 * @description
	 * Delete user by email.
	 *
	 * @param  {Object} req - current client request.
	 * @param  {Function} cb - callback function.
	 * @return {Object}
	 * @public
	 */
	function deleteUser (req, cb) {
		var response = _getMessageBody();
		User.findOneAndRemove({email: req.params.email}, function (err, user) {
			if (err) {
				return debug.error('service', {
					method: 'deleteUser',
					error: err
				});
			}

			response.data = 'Deleted user.';
			return cb(response);
		});
	}

	/**
	 * @description
	 * User service API.
	 *
	 * @public
	 */
	return {
		createUser: createUser,
		getAllUsers: getAllUsers,
		getUserByEmail: getUserByEmail,
		getUserById: getUserById,
		updateUser: updateUser,
		deleteUser: deleteUser
	};
})();