/**
 * @param {...*}
 * @return {array}
 */
var merge = function() {
  return Array.prototype.concat.apply([], arguments);
};

module.exports = function(grunt) {
  'use strict';

  // Tasks for manageing version numbers
  grunt.loadNpmTasks('grunt-bump');

  // Tasks for running tests
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Task for distributing
  grunt.loadTasks('grunt-tasks');

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-uncss');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-rename');
  grunt.loadNpmTasks('grunt-node-webkit-builder');

  var jsFilesForDistributing = [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/bootstrap/js/button.js',
    'bower_components/jquery.auto-grow/src/jquery.auto-grow.js',
    'bower_components/regex-colorizer/regex-colorizer.js',
    'bower_components/clipboard/dist/clipboard.js',
    'js/escape.js',
    'js/pattern.js',
    'js/haystack.js',
    'js/matches.js',
    'js/regexify.js'
  ];

  var cssFilesForDistributing = [
    'bower_components/bootstrap/dist/css/bootstrap.css',
    'bower_components/jquery.auto-grow/src/auto-grow.css'
  ];

  var htmlFilesForDistributing = [
    'cheat-sheet.html',
    'index.html'
  ];


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        commitFiles: ['package.json', 'bower.json'],
        push: false
      }
    },

    qunit: { files: ['test/index.html'] },
    jshint: ['js/**/*.js', 'Gruntfile.js', 'test/**/*.js'],

    'activate-prod-only-code': {
      web: {
        expand: true, nonull: true, cwd: 'releases/web/',
        src: merge(
          jsFilesForDistributing,
          cssFilesForDistributing,
          htmlFilesForDistributing
        ),
        rename: function(dest, src) { return this.cwd + src; }
      },
      desktop: {
        expand: true, nonull: true, cwd: 'releases/desktop/',
        src: merge(
          jsFilesForDistributing,
          cssFilesForDistributing,
          htmlFilesForDistributing
        ),
        rename: function(dest, src) { return this.cwd + src; }
      }
    },
    'deactivate-dev-only-code': {
      web: {
        expand: true, nonull: true, cwd: 'releases/web/',
        src: merge(
          jsFilesForDistributing,
          cssFilesForDistributing,
          htmlFilesForDistributing
        ),
        rename: function(dest, src) { return this.cwd + src; }
      },
      desktop: {
        expand: true, nonull: true, cwd: 'releases/desktop/',
        src: merge(
          jsFilesForDistributing,
          cssFilesForDistributing,
          htmlFilesForDistributing
        ),
        rename: function(dest, src) { return this.cwd + src; }
      }
    },

    concat: {
      web: {
        src: cssFilesForDistributing,
        dest: 'releases/web/css/main.min.css'
      },
      desktop: {
        src: cssFilesForDistributing,
        dest: 'releases/desktop/css/main.min.css'
      }
    },
    uncss: {
      web: {
        files: {
          'releases/web/css/main.min.css': htmlFilesForDistributing
        },
        options: {
          ignore: ['.text-justify', '.text-right']
        }
      },
      desktop: {
        files: {
          'releases/desktop/css/main.min.css': htmlFilesForDistributing
        },
        options: {
          ignore: ['.text-justify', '.text-right']
        }
      }
    },
    cssmin: {
      web: {
        src: [
          'releases/web/css/main.min.css',
          'css/style.css'
        ],
        dest: 'releases/web/css/main.min.css'
      },
      desktop: {
        src: [
          'releases/desktop/css/main.min.css',
          'css/style.css'
        ],
        dest: 'releases/desktop/css/main.min.css'
      },
      options: { keepSpecialComments: 0 }
    },
    uglify: {
      web: {
        src: jsFilesForDistributing.map(function(oneFile) {
          return 'releases/web/' + oneFile;
        }),
        dest: 'releases/web/js/base.min.js'
      },
      desktop: {
        src: jsFilesForDistributing.map(function(oneFile) {
          return 'releases/desktop/' + oneFile;
        }),
        dest: 'releases/desktop/js/base.min.js'
      }
    },
    htmlmin: {
      web: {
        expand: true, nonull: true, cwd: 'releases/web/',
        src: htmlFilesForDistributing,
        rename: function(dest, src) { return this.cwd + src; }
      },
      desktop: {
        expand: true, nonull: true, cwd: 'releases/desktop/',
        src: htmlFilesForDistributing,
        rename: function(dest, src) { return this.cwd + src; }
      },
      options: {
        removeComments: true,
        removeCommentsFromCDATA: true,
        removeCDATASectionsFromCDATA: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        useShortDoctype: true
      }
    },

    copy: {
      web: {
        files: [
          {
            src: [
              '**', '!releases/**', '!cache/**', '!test/**', '!grunt-tasks/**',
              '!**/*.psd', '!img/*.icns'
            ],
            dest: 'releases/web/'
          }
        ]
      },
      desktop: {
        files: [
          {
            src: [
              '**', '!releases/**', '!cache/**', '!test/**', '!grunt-tasks/**',
              '!**/*.psd', '!img/*.icns'
            ],
            dest: 'releases/desktop/'
          }
        ]
      }
    },
    clean: {
      beforeWeb: 'releases/web/*',
      beforeDesktop: 'releases/desktop/*',
      web: {
        files: [
          { expand: true, nonull: true, cwd: 'releases/web/', src: [
            'bower_components/',
            'node_modules/',
            'css/**/*.css', '!css/*.min.css',
            'js/**/*.js', '!js/**/*.min.js'
          ] },
          { expand: true, nonull: true, cwd: 'releases/web/', filter: 'isFile',
            src: [ '*', '!index.html', '!cheat-sheet.html' ]
          }
        ]
      },
      desktop: {
        files: [
          { expand: true, nonull: true, cwd: 'releases/desktop/', src: [
            'bower_components/',
            'node_modules/',
            'css/**/*.css', '!css/*.min.css',
            'js/**/*.js', '!js/**/*.min.js',
            'img/favicon.ico', 'img/logo.png'
          ] },
          { expand: true, nonull: true, cwd: 'releases/desktop/', filter: 'isFile',
            src: [ '*', '!index.html', '!cheat-sheet.html', '!package.json' ]
          }
        ]
      },
      afterDesktop: 'releases/desktop'
    },
    nodewebkit: {
      src: 'releases/desktop/**/*',
      options: {
        build_dir: './',
        win: true, mac: true, linux32: true, linux64: true,
        mac_icns: 'img/logo.icns'
      }
    },
    rename: {
      desktop: {
        src: 'releases/<%= pkg.name %>',
        dest: 'releases/desktop'
      }
    },

    dist: {
      web: [
        'clean:beforeWeb', 'copy:web',
        'deactivate-dev-only-code:web', 'activate-prod-only-code:web',
        'concat:web', 'uncss:web', 'cssmin:web', 'uglify:web', 'htmlmin:web',
        'clean:web'
      ],
      desktop: [
        'clean:beforeDesktop', 'copy:desktop',
        'deactivate-dev-only-code:desktop', 'activate-prod-only-code:desktop',
        'concat:desktop', 'uncss:desktop', 'cssmin:desktop', 'uglify:desktop', 'htmlmin:desktop',
        'clean:desktop',
        'nodewebkit',
        'clean:afterDesktop', 'rename:desktop'
      ]
    }
  });

  grunt.registerTask('test', ['qunit', 'jshint']);
  grunt.registerMultiTask('dist', function() {
    grunt.task.run(this.data);
  });
};
