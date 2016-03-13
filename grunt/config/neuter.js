/*jshint node:true*/
'use strict';

// https://github.com/trek/grunt-neuter

module.exports = function (config) {
    return {
        options : {
            basePath : config.source
        },
        app: {
            src: config.source + 'js/main.js',
            dest: config.temp + 'js/main.develop.js'
        },
        libsDevelop: {
            options: {
                template : '{%= src %}'
            },
            src: config.source + 'js/libs.js',
            dest: config.temp + 'js/libs.develop.js'
        },
        libsBuild: {
            options: {
                template : '{%= src %}'
            },
            src: config.source + 'js/libs.js',
            dest: config.temp + 'js/libs.develop.js'
        }
    };
};
