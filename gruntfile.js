module.exports = function(grunt){

    'use strict';

    grunt.initConfig({
        jshint: {
            files: ['src/*.js', 'test/tests.js']
        },
        uglify: {
            build: {
                src: 'src/cache.js',
                dest: 'dist/cache.min.js'
            }
        },
        watch: {
            files: ['src/*.js'],
            tasks: ['test']
        },
        mocha: {
            test: {
                src: ['test/*.html']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-mocha');

    grunt.registerTask('build', ['uglify']);

    grunt.registerTask('test', ['build', 'mocha']);
};