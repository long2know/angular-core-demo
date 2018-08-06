/// <binding BeforeBuild='clean' AfterBuild='copy, min' Clean='clean' />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    watch = require("gulp-watch"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    gap = require("gulp-append-prepend"),
    merge2 = require("merge2");

var
    webroot = "./wwwroot/",
    paths = {
        webroot: webroot,

        js: webroot + "js/**/*.js",
        minJs: webroot + "js/**/*.min.js",
        css: webroot + "assets/**/*.css",

        minCss: webroot + "assets/**/*.min.css",
        concatCssDest: webroot + "assets/site.min.css",

        libJs: webroot + "assets/scripts/**/*.js",
        minLibJs: webroot + "assets/scripts/**/*.min.js",
        concatLibJsDest: webroot + "assets/lib.min.js",

        npmSrc: "./node_modules/",
        npmLibs: webroot + "lib/npmlibs/"
    };

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatLibJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:css"]);

gulp.task("min:libjs", function () {
    //return gulp.src([
    //    paths.webroot + "scripts/lib/toastr/toastr.js",
    //    paths.webroot + "scripts/lib/spin/spin.js",
    //    paths.webroot + "scripts/lib/spin/jquery.spin.js"], { base: "." })
    //    .pipe(concat(paths.concatLibJsDest))
    //    //.pipe(uglify())
    //    .pipe(gulp.dest("."));
    return gulp.src([paths.libJs, "!" + paths.minLibJs])
        .pipe(concat(paths.concatLibJsDest))
        //.pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    return gulp.src([paths.npmSrc + '/bootstrap/dist/css/bootstrap.css', paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task('copy', function () {
    gulp.src('./ClientApp/app/assets/**/*').pipe(gulp.dest(paths.webroot + '/assets'));
    gulp.src(paths.npmSrc + '/bootstrap/dist/**/*.*', { base: paths.npmSrc + '/bootstrap/' })
        .pipe(gulp.dest(paths.npmLibs + '/bootstrap/'));

    gulp.src(paths.npmSrc + '/jquery/dist/**/*.*', { base: paths.npmSrc + '/jquery/' })
        .pipe(gulp.dest(paths.npmLibs + '/jquery/'));
});

gulp.task("min", ["min:libjs", "min:css"]);

//gulp.task('watch', function () {
//    gulp.watch(['./content/**/*', './scripts/lib/**/*.js', './scripts/app/**/*.js'], ['copy', 'min']);
//});