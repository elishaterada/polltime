/**
 * Require Browsersync
 */
var browserSync = require('browser-sync').create()
var historyApiFallback = require('connect-history-api-fallback')

/**
 * Run Browsersync with server config
 */
browserSync.init({
  server: 'public',
  files: ['public/**/*.*'],
  middleware: [require('connect-logger')(), historyApiFallback()]
})
