/**
 * Dependencies
 */
var gulp = require('gulp');
var serve = require('gulp-serve');
var fs = require('fs');
var del = require('del');
var exec = require('gulp-exec');
var concat = require('gulp-concat');

/**
 * Clean
 */
gulp.task('clean', function(cb) {
  del('out').then(function () {
    cb();
  });
});

/**
 * KSS
 */
gulp.task('kss', ['clean'], function(cb) {
  var options = {
    continueOnError: false,
    pipeStdout: true
  };
  var reportOptions = {
    err: true,
    stderr: true,
    stdout: true
  };
  return gulp.src('styleguide')
    .pipe(exec('kss --config=.kss-node.json', options))
    .pipe(exec.reporter(reportOptions));
});

/**
 * Sets up Bootstrap CSS for KSS.
 */
gulp.task('kss-foundation-css', ['kss'], function() {
  var sources = [
    'node_modules/foundation-sites/dist/foundation.css'
  ];
  return gulp.src(sources)
    .pipe(concat('main.css'))
    .pipe(gulp.dest('out/'));
});

/**
 * Sets up Bootstrap JS for KSS.
 */
gulp.task('kss-foundation-js', ['kss'], function() {
  var sources = [
    'node_modules/jquery/dist/jquery.js',
    'node_modules/foundation-sites/dist/foundation.js',
  ];
  return gulp.src(sources)
    .pipe(concat('main.js'))
    .pipe(gulp.dest('out/'));
});

/**
 * Deploy
 */
gulp.task('deploy', ['kss-foundation'], function () {
  var deploy = require('gulp-gh-pages');
  return gulp.src('./out/**/*')
    .pipe(deploy());
});

/**
 * Serve
 */
gulp.task('serve', ['kss-foundation'], serve({
  root: ['out'],
  port: 8000
}));

/**
 * Watch
 */
gulp.task('watch', ['kss-foundation'], function() {
  gulp.watch(['styleguide/**'], ['kss-foundation']);
});

/**
 * Set up the assets.
 */
gulp.task('kss-foundation', ['kss-foundation-css', 'kss-foundation-js']);

/**
 * Default tasks
 */
gulp.task('start', ['clean', 'kss-foundation', 'serve', 'watch']);
gulp.task('test', ['kss-foundation']);
gulp.task('default', ['test']);
