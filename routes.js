const {
    HomeController 
} = require('./http/controllers');

module.exports = app => {
    app.use('/', HomeController);
};
