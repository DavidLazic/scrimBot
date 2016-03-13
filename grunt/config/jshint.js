/*jshint node:true*/
'use strict';

// https://github.com/gruntjs/grunt-contrib-jshint

module.exports = function (config) {
    return {
        options: {
            jshintrc: '.jshintrc'
        },
        all: [
            'Gruntfile.js',
            'grunt/**/*.js',
            config.source + 'js/**/*.js'
        ]
    };
};
