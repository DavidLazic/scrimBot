/*jshint node:true*/
'use strict';

// https://github.com/gruntjs/grunt-contrib-copy

module.exports = function (config) {
    return {
        build: {
            files: [{
                expand: true,
                dot: true,
                cwd: config.source,
                dest: config.temp,
                src: [
                    'fonts/**/*'
                ]
            }]
        }
    };
};
