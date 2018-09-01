/*global module:false*/
module.exports = function(grunt) {
    // Load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        babel: {
            options: {
                sourceMap: true,
                presets: ['@babel/preset-env']
            },
            // dist: {
            //     files: {
            //         // 'lib/htmlhint.js': 'lib/htmlhint.js'
            //         'lib/htmlhint.js': 'src/index.js'
            //     }
            // }
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['**/*.js'],
                        dest: 'lib/'
                    }
                ]
            }
        },
        browserify: {
            lib: {
                files: {
                    // destination for transpiled js : source js
                    'lib/htmlhint.js': 'src/index.js'
                },
                options: {
                    transform: [['babelify', { presets: 'env' }]],
                    browserifyOptions: {
                        debug: true
                    }
                }
            }
        },
        // jshint: {
        //     browser: {
        //         src: ['src/**/*.js'],
        //         options: {
        //             jshintrc: '.jshintrc-browser'
        //         }
        //     },
        //     node: {
        //         src: ['Gruntfile.js', 'test/**/*.js', 'bin/*'],
        //         options: {
        //             jshintrc: '.jshintrc-node'
        //         }
        //     }
        // },
        clean: ['lib', 'coverage'],
        concat: {
            htmlhint: {
                src: [
                    'src/rules/*.js',
                    'src/reporter.js',
                    'src/htmlparser.js',
                    'src/core.js',
                    'src/htmlhint.js'
                ],
                dest: 'lib/htmlhint.js'
            }
        },
        exec: {
            test: {
                command: '"./node_modules/.bin/mocha" --recursive',
                stdout: true,
                stderr: true
            },
            cover: {
                command:
                    '"./node_modules/.bin/istanbul" cover "./node_modules/mocha/bin/_mocha" -- --recursive',
                stdout: true,
                stderr: true
            }
        },
        uglify: {
            htmlhint: {
                options: {
                    beautify: {
                        ascii_only: true
                    }
                },
                files: {
                    'lib/htmlhint.js': ['lib/htmlhint.js']
                }
            }
        },
        replace: {
            version: {
                files: {
                    'lib/htmlhint.js': 'lib/htmlhint.js'
                },
                options: {
                    prefix: '@',
                    variables: {
                        VERSION: '<%= pkg.version %>',
                        RELEASE: dateFormat('yyyyMMdd')
                    }
                }
            }
        },
        watch: {
            src: {
                files: ['src/**/*.js', 'test/**/*.js'],
                tasks: 'dev'
            }
        }
    });

    // grunt.registerTask('build', ['clean', 'concat', 'babel']);
    grunt.registerTask('build', ['clean', 'babel']);
    // grunt.registerTask('build', ['clean', 'browserify:lib']);

    grunt.registerTask('dev', ['build', 'exec:test']);

    grunt.registerTask('default', [
        'build',
        'exec:cover',
        'uglify',
        'replace:version'
    ]);

    function dateFormat(date, format) {
        if (format === undefined) {
            format = date;
            date = new Date();
        }
        var map = {
            "M": date.getMonth() + 1, // Monat
            "d": date.getDate(), // Tag
            "h": date.getHours(), // Hour
            "m": date.getMinutes(), // Minute
            "s": date.getSeconds(), // Second
            "q": Math.floor((date.getMonth() + 3) / 3), // Quarter
            "S": date.getMilliseconds() // Millisecond
        };
        format = format.replace(/([yMdhmsqS])(\1)*/g, function(all, t) {
            var v = map[t];
            if (v !== undefined) {
                if (all.length > 1) {
                    v = '0' + v;
                    v = v.substr(v.length - 2);
                }
                return v;
            } else if (t === 'y') {
                return (date.getFullYear() + '').substr(4 - all.length);
            }
            return all;
        });
        return format;
    }
};
