/*jshint node:true*/
'use strict';

// https://github.com/sindresorhus/grunt-shell

module.exports = function () {
    return {
        develop: {
            command: 'grunt develop & npm run start:debug'
        },
        server: {
            command: 'npm run start'
        }
    };
};
