var gulp = require('gulp')
var pug = require('gulp-pug')
var stylus = require('gulp-stylus')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var babelify = require('babelify')
var buffer = require('vinyl-buffer')
var p = require('partialify')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var watch = require('gulp-watch');


gulp.task('css',function(){
    gulp.src('./dev/scss/main.styl')
        .pipe(stylus(
            {'include css':true}
        ))
        .pipe(gulp.dest('./public/css/'))
})

gulp.task('js',function(){
    return browserify('./main.js')
        .transform('babelify',{presets:['es2015']})
        .transform(p)
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        //.pipe(uglify())
        .pipe(gulp.dest('./../../../public/js/'))
})

gulp.task('menu',function(){
    return browserify('./dev/menu/menu.js')
        .transform('babelify',{presets:['es2015']})
        .bundle()
        .pipe(source('menu.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./public/js/'))
})


gulp.task('stylus',function(){
    return watch ('./../stylus/main.styl',function(){
        gulp.src('./../stylus/main.styl')
        .pipe(stylus(
            {'include css':true}
        ))
        .pipe(gulp.dest('./../../../public/css/'))
        console.log('cambiando.....')
    })
})



gulp.task('vistaRender',['html','css'])
