const express = require('express');
const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const socket = require('socket.io')();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/dist', express.static(path.join(__dirname, 'dist')));

if (process.env.NODE_ENV === 'local') {
    const webpackConfig = require(`./webpack.config.${process.env.NODE_ENV}.js`);
    const compiler = webpack(webpackConfig);

    app.use(webpackDevMiddleware(compiler, {
        publicPath: '/dist/'
    }));
}

require('./routes')(app);

// catch 404 and forward to error handler
app.use((req, res, next) => next({ message: 'Not Found', status: 404 }));

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'develop' ? err : {};

    res.status(err.status || 500);
    res.json({ error: err.message });
});

module.exports = app;
