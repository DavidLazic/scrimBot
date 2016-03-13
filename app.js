var express = require('express');
var socket = require('socket.io')();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('./lib/debug/debug.js');
var ejs = require('ejs');

var ROUTES = require('./config/routes/routes.cfg');

module.exports = (function () {
    'use strict';

    /**
     * @description
     * Set routes.
     *
     * @param {Object} router
     * @private
     */
    function _setRoutes (router) {
        ROUTES.forEach(function (route) {
            require('./lib/modules/' + route + '/' + route).init(router);
        });
    }

    /**
     * @description
     * Set public API routes.
     *
     * @param {Object} io
     * @private
     */
    function _setApi (io) {
        io.on('connection', function (socket) {
            require('./lib/api/api').init(socket);
        });
    }

    /**
     * @description
     * Set middleware.
     *
     * @param {Object} app
     * @private
     */
    function _setMiddleware (app) {
        app.use(function (req, res, next) {
            debug.log('route', req);
            res.header('Access-Control-Allow-Origin', 'http://localhost:5000');
            res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, 'src')));
        app.use('/scripts', express.static(path.join(__dirname + '/.tmp/js/')));
        app.use('/styles', express.static(path.join(__dirname + '/.tmp/css/')));
    }

    /**
     * @description
     * Set view engine to EJS templating system.
     *
     * @param {Object} app
     * @private
     */
    function _setViewEngine (app) {
        app.set('views', path.join(__dirname, 'src/templates'));
        app.set('view engine', 'ejs');
    }

    /**
     * @description
     * Set middleware.
     *
     * @param {Object} app
     * @return {Object}
     * @private
     */
    function _setErrorHandler (app) {

        // catch 404 and forward to error handler
        app.use(function (req, res, next) {
            debug.error('route', {
                method: '_setErrorHandler',
                error: 404
            });
            var err = new Error('Not found.');
            err.status = 404;
            next(err);
        });

        // error handler
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.send({
                message: 'error',
                status: err.status
            });
        });
    }

    /**
     * @description
     * Init fn.
     *
     * @return void
     * @public
     */
    function init () {
        var app = express();
        var router = express.Router();

        app.socket = socket;

        _setMiddleware(app);
        _setViewEngine(app);
        _setApi(app.socket);
        _setRoutes(router);
        app.use('/', router);
        _setErrorHandler(app);

        return app;
    }

    /**
     * @description
     * App module API.
     *
     * @public
     */
    return {
        init: init
    };
})().init();