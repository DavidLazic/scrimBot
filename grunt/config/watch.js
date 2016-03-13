/*jshint node:true*/
'use strict';

// https://github.com/gruntjs/grunt-contrib-watch

module.exports = function (config) {
    return {
        sass: {
            files: [config.source + 'scss/{,**/}{,*.scss,*.sass}'],
            tasks: ['sass:develop', 'autoprefixer:develop']
        },
        neuter: {
            files: [config.source + 'js/{,**/}{,*.js}'],
            tasks: ['neuter:app', 'jshint']
        },
        neuterLibs: {
            files: [config.source + 'js/libs.js'],
            tasks: ['neuter:libsDevelop']
        }
    };
};
