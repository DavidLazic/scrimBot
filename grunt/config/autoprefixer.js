/*jshint node:true*/
'use strict';

// https://github.com/nDmitry/grunt-autoprefixer

module.exports = function (config) {
    return {
        options: {
            browsers: ['> 1%', 'last 2 versions', 'ie 9']
        },
        build: {
            files : [{
                expand: true,
                cwd: '.temp/css/',
                src: '*.css',
                dest: config.temp + 'css/'
            }]
        },
        develop: {
            files : '<%= autoprefixer.build.files %>',
            options: {
                map: true
            }
        }
    };
};
