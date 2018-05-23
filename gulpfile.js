var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');
var DEST = 'dist/';

gulp.task('minjs', function () {
    return gulp.src('src/cache.js')
        // 这会输出一个未压缩过的版本
        .pipe(gulp.dest(DEST))
        // 这会输出一个压缩过的并且重命名未 foo.min.js 的文件
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(DEST));
});

gulp.task('watch-minjs', function () {
    gulp.watch('src/cache.js', ['minjs']);
});

gulp.task('test', function () {
    return gulp.src('test/*.js')
        .pipe(mocha({ reporter: 'spec' }))
})

gulp.task('default', ['watch-minjs', 'test']);