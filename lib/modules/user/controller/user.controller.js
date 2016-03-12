var UserService = require('../service/user.service.js');

module.exports = (function() {
	'use strict';

	/**
	 * @description
	 * Create user.
	 *
	 * @param  {Object} req - client request.
	 * @param  {Object} res - server response.
	 * @return {Object}
	 * @public
	 */
	function createUser (req, res) {
		UserService.createUser(req, function (response) {
			return res.json(response);
		});
	}

	/**
	 * @description
	 * Get user by email.
	 *
	 * @param  {Object} req - client request.
	 * @param  {Object} res - server response.
	 * @return {Object}
	 * @public
	 */
	function getUserByEmail (req, res) {
		UserService.getUserByEmail(req, function (response) {
			return res.json(response);
		});
	}

	/**
	 * @description
	 * Get user by id.
	 *
	 * @param  {Object} req - client request.
	 * @param  {Object} res - server response.
	 * @return {Object}
	 * @public
	 */
	function getUserById (req, res) {
		UserService.getUserById(req, function (response) {
			return res.json(response);
		});
	}

	/**
	 * @description
	 * Get all users.
	 *
	 * @param  {Object} req - client request.
	 * @param  {Object} res - server response.
	 * @return {Object}
	 * @public
	 */
	function getAllUsers (req, res) {
		UserService.getAllUsers(function (response) {
			return res.json(response);
		});
	}

	/**
	 * @description
	 * Update user.
	 *
	 * @param  {Object} req - client request.
	 * @param  {Object} res - server response.
	 * @return {Object}
	 * @public
	 */
	function updateUser (req, res) {
		UserService.updateUser(req, function (response) {
			return res.json(response);
		});
	}

	/**
	 * @description
	 * Delete user.
	 *
	 * @param  {Object} req - client request.
	 * @param  {Object} res - server response.
	 * @return {Object}
	 * @public
	 */
	function deleteUser (req, res) {
		UserService.deleteUser(req, function (response) {
			return res.json(response);
		});
	}

	/**
	 * @description
	 * User controller API.
	 *
	 * @public
	 */
	return {
		create: createUser,
		read: getUserByEmail,
		ping: getUserById,
		readAll: getAllUsers,
		update: updateUser,
		delete: deleteUser
	};
})();