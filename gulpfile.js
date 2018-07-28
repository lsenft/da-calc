'use strict';

// gulp
let gulp = require('gulp');
let jshint = require('gulp-jshint');
let uglify = require('gulp-uglify-es').default;
let minifyCSS = require('gulp-minify-css');
let clean = require('gulp-clean');
let runSequence = require('run-sequence');
let  useref = require('gulp-useref');
let gulpif = require('gulp-if');
// tasks
gulp.task('lint', function() {
    gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('clean', function() {
    gulp.src('./docs/*')
        .pipe(clean({force: true}));
});

// gulp.task('minify-css', function() {
//     var opts = {comments:true,spare:true};
//     gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
//         .pipe(minifyCSS(opts))
//         .pipe(gulp.dest('./docs/'));
// });
// gulp.task('minify-js', function() {
//     gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
//         .pipe(uglify({
//             // inSourceMap:
//             // outSourceMap: "app.js.map"
//         }))
//         .pipe(gulp.dest('./docs/'));
// });
gulp.task('copy-bower-components', function () {
    gulp.src('./app/bower_components/**')
        .pipe(gulp.dest('docs/bower_components'));
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
        ['clean'],
        ['copy-bower-components', 'lint', 'html']
    );
});