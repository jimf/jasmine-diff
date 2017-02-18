/* jshint node:true */
'use strict'

module.exports = function (config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    frameworks: ['browserify', 'jasmine'],

    // list of files / patterns to load in the browser
    files: [
      './failure_inline.js'
    ],

    // list of files to exclude
    exclude: [],

    preprocessors: {
      './failure_inline.js': ['browserify']
    },

    browserify: {
      debug: true
    },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit'
    reporters: ['dots'],

    // web server port
    port: 9876,

    // cli runner port
    runnerPort: 9100,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_{DISABLE,ERROR,WARN,INFO,DEBUG}
    logLevel: config.LOG_WARN,

    // watch files and execute tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  })
}
