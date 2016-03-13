/*jshint node:true*/
'use strict';

var CONFIG = {
    source: 'src/',
    temp: '.tmp/'
};

module.exports = function (grunt) {
    require('time-grunt')(grunt);
    require('jit-grunt')(grunt);

    [
        'autoprefixer',
        'clean',
        'copy',
        'jshint',
        'neuter',
        'notify',
        'sass',
        'shell',
        'uglify',
        'watch'
    ].forEach(function (key) {
        grunt.config(key, require('./grunt/config/' + key)(CONFIG));
    });

    grunt.registerTask('develop', [
        'clean:build',

        // JS
        'neuter:libsDevelop',
        'neuter:app',

        // CSS
        'sass:develop',
        'autoprefixer:develop',

        'copy:build',

        // Watch files for changes
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean:build',

        // JS
        'jshint',
        'neuter:libsBuild',
        'neuter:app',
        'uglify',

        // CSS
        'sass:build',
        'autoprefixer:build',

        'copy:build',

        // OTHER
        'notify:build',
        'shell:server'
    ]);

    grunt.registerTask('serve', function () {
        grunt.task.run([
            'shell:develop'
        ]);
    });
};