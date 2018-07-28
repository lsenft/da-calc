'use strict';

// gulp
let gulp = require('gulp');
let jshint = require('gulp-jshint');
let uglify = require('gulp-uglify-es').default;
let minifyCSS = require('gulp-minify-css');
let runSequence = require('run-sequence');
let useref = require('gulp-useref');
let gulpif = require('gulp-if');


let onError = function(err) {
    console.log(err);
};


// tasks
gulp.task('lint', function() {
    gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('copy-bower-components', function () {
    gulp.src('./app/bower_components/**')
        .pipe(gulp.dest('docs/bower_components'));
});

gulp.task('copy-assets', function() {
    gulp.src('./app/*.{png,json,xml,ico}')
        .pipe(gulp.dest('./docs'));
});

gulp.task('html', function () {
    gulp.src('./app/**/*.html')
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