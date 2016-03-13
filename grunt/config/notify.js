/*jshint node:true*/
'use strict';

// https://github.com/dylang/grunt-notify

module.exports = function () {
    return {
        build: {
            options: {
                message: 'Build complete.'
            }
        }
    };
};
