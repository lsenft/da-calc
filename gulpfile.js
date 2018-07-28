'use strict';

// gulp
let gulp = require('gulp');
let jshint = require('gulp-jshint');
let uglify = require('gulp-uglify-es').default;
let minifyCSS = require('gulp-minify-css');
let runSequence = require('run-sequence');
let useref = require('gulp-useref');
let gulpif = require('gulp-if');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');


let onError = function(err) {
    notify.onError({
        title: "Gulp error in " + err.plugin,
        message:  err.toString()
    })(err);
};


// tasks
gulp.task('lint', function() {
    gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
        .pipe(plumber({ errorHandler: onError}))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('copy-bower-components', function () {
    gulp.src('./app/bower_components/**')
        .pipe(plumber({ errorHandler: onError}))
        .pipe(gulp.dest('docs/bower_components'));
});

gulp.task('copy-assets', function() {
    gulp.src('./app/*.{png,json,xml,ico}')
        .pipe(plumber({ errorHandler: onError}))
        .pipe(gulp.dest('./docs'));
});

gulp.task('html', function () {
    gulp.src('./app/**/*.html')
        .pipe(plumber({ errorHandler: onError}))
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCSS()))
        .pipe(gulp.dest('docs/'));
});


gulp.task('build', function() {
    runSequence(
        ['copy-bower-components', 'copy-assets', 'lint', 'html']
    );
});