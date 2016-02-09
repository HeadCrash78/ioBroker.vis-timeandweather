// To use this file in WebStorm, right click on the file name in the Project Panel (normally left) and select "Open Grunt Console"

/** @namespace __dirname */
/* jshint -W097 */// jshint strict:false
/*jslint node: true */
"use strict";

module.exports = function (grunt) {

    var srcDir    = __dirname + '/';
    var dstDir    = srcDir + '.build/';
    var pkg       = grunt.file.readJSON('package.json');
    var iopackage = grunt.file.readJSON('io-package.json');
    var version   = (pkg && pkg.version) ? pkg.version : iopackage.common.version;

    console.log(srcDir + 'widgets/' + pkg.name.substring('iobroker.vis-'.length) + '/js/' + pkg.name.substring('iobroker.vis-'.length) + '.js');
    // Project configuration.
    grunt.initConfig({
        pkg: pkg,
        clean: {
            all: ['tmp/*.json', 'tmp/*.zip', 'tmp/*.jpg', 'tmp/*.jpeg', 'tmp/*.png',
                  dstDir + '*.json', dstDir + '*.zip', dstDir + '*.jpg', dstDir + '*.jpeg', dstDir + '*.png']
        },
        replace: {
            core: {
                options: {
                    patterns: [
                        {
                            match: /version: *"[\.0-9]*"/g,
                            replacement: 'version: "' + version + '"'
                        },
                        {
                            match: /"version":\s*"[\.0-9]*",/g,
                            replacement: '"version": "' + version + '",'
                        },
                        {
                            match: /version: *"[\.0-9]*",/g,
                            replacement: 'version: "' + version + '",'
                        }
                    ]
                },
                files: [
                    {
                        expand:  true,
                        flatten: true,
                        src:     [
                            srcDir + 'package.json',
                            srcDir + 'io-package.json'
                        ],
                        dest:    srcDir
                    },
                    {
                        expand:  true,
                        flatten: true,
                        src:     [
                            srcDir + 'widgets/' + pkg.name.substring('iobroker.vis-'.length) + '.html'
                        ],
                        dest:    srcDir + 'widgets'
                    },
                    {
                        expand:  true,
                        flatten: true,
                        src:     [
                            srcDir + 'widgets/' + pkg.name.substring('iobroker.vis-'.length) + '/js/' + pkg.name.substring('iobroker.vis-'.length) + '.js'
                        ],
                        dest:    srcDir + 'widgets/' + pkg.name.substring('iobroker.vis-'.length) + '/js/'
                    }
                ]
            }
        },
        // Javascript code styler
        jscs:   require(__dirname + '/tasks/jscs.js'),
        // Lint
        jshint: require(__dirname + '/tasks/jshint.js'),
        http: {
            get_hjscs: {
                options: {
                    url: 'https://raw.githubusercontent.com/ioBroker/ioBroker.js-controller/master/tasks/jscs.js'
                },
                dest: 'tasks/jscs.js'
            },
            get_jshint: {
                options: {
                    url: 'https://raw.githubusercontent.com/ioBroker/ioBroker.js-controller/master/tasks/jshint.js'
                },
                dest: 'tasks/jshint.js'
            },/*
            get_gruntfile: {
                options: {
                    url: 'https://raw.githubusercontent.com/ioBroker/ioBroker.build/master/adapters/Gruntfile.js'
                },
                dest: 'Gruntfile.js'
            },
            get_utilsfile: {
                options: {
                    url: 'https://raw.githubusercontent.com/ioBroker/ioBroker.build/master/adapters/utils.js'
                },
                dest: 'lib/utils.js'
            },*/
            get_jscsRules: {
                options: {
                    url: 'https://raw.githubusercontent.com/ioBroker/ioBroker.js-controller/master/tasks/jscsRules.js'
                },
                dest: 'tasks/jscsRules.js'
            }
        }
    });

    grunt.registerTask('updateReadme', function () {
        var readme = grunt.file.read('README.md');
        var pos = readme.indexOf('## Changelog\r\n');
        if (pos != -1) {
            var readmeStart = readme.substring(0, pos + '## Changelog\r\n'.length);
            var readmeEnd   = readme.substring(pos + '## Changelog\r\n'.length);

            if (readme.indexOf(version) == -1) {
                var timestamp = new Date();
                var date = timestamp.getFullYear() + '-' +
                    ("0" + (timestamp.getMonth() + 1).toString(10)).slice(-2) + '-' +
                    ("0" + (timestamp.getDate()).toString(10)).slice(-2);

                var news = "";
                if (iopackage.common.whatsNew) {
                    for (var i = 0; i < iopackage.common.whatsNew.length; i++) {
                        if (typeof iopackage.common.whatsNew[i] == 'string') {
                            news += '* ' + iopackage.common.whatsNew[i] + '\r\n';
                        } else {
                            news += '* ' + iopackage.common.whatsNew[i].en + '\r\n';
                        }
                    }
                }

                grunt.file.write('README.md', readmeStart + '### ' + version + ' (' + date + ')\r\n' + (news ? news + '\r\n\r\n' : '\r\n') + readmeEnd);
            }
        }
    });

    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-http');

    grunt.registerTask('default', [
        'http',
        'replace',
        'updateReadme',
        'jshint',
        'jscs'
    ]);
    grunt.registerTask('prepublish', [
        'replace',
        'updateReadme'
    ]);
	grunt.registerTask('p', [
        'prepublish'
    ]);
};