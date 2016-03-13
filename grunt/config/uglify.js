/*jshint node:true*/
'use strict';

// https://github.com/gruntjs/grunt-contrib-uglify

module.exports = function (config) {
    return {
        app: {
            src: config.temp + 'js/{templates,main}.develop.js',
            dest: config.temp + 'js/app.min.js'
        },
        libs: {
            src: config.temp + 'js/libs.develop.js',
            dest: config.temp + 'js/libs.min.js'
        }
    };
};
