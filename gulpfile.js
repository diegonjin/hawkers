var gulp = require("gulp");
var jsonServer = require("gulp-json-srv");
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;
var gulpSequence = require('gulp-sequence');
var server = require('gulp-server-livereload');
var sass = require('gulp-sass');
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");

var CONFIG = {
  PATHS: {
    indexHtml: './app/index.html',
    cssMainFile: './app/styles/theme.css',
    sassSources: './app/**/*.scss',
    appSources: ['./app/**/*.js', './app/**/*.css'],
    jsSources: ['./app/**/*.js'],
    distFolder: ['./dist']
  }
};


/**
*  Tasks for server
*/
// Launch a json server with json-server in port 3000
gulp.task("jsonserver", function(){
    var server = jsonServer.create();

    return gulp.src("server/db.json")
        .pipe(server.pipe());
});

gulp.task('webserver', function() {
  gulp.src('app')
    .pipe(server({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

//Tasks for compiling sass

gulp.task('sass', function () {
 return gulp.src(CONFIG.PATHS.sassSources)
   .pipe(sass().on('error', sass.logError))
   .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
 gulp.watch(CONFIG.PATHS.sassSources, ['sass']);
});

// Tasks for compiling javascript

gulp.task('compileES6', function () {
  return gulp.src(CONFIG.PATHS.jsSources)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'));
});


// Tasks for building app

// Inject css and js vendor's files into index.html
gulp.task('injectVendor', function() {
    var paths = {};
    gulp.src(CONFIG.PATHS.indexHtml)
        .pipe(wiredep({}))
        .pipe(gulp.dest('./app'));
});

// Inject css and js own files into index.html
gulp.task('injectAppSources', function () {
  var target = gulp.src(CONFIG.PATHS.indexHtml)
    .pipe(inject(gulp.src(CONFIG.PATHS.appSources, {read: false})))
    .pipe(gulp.dest('./app'));
});

gulp.task('injectIndex', gulpSequence('injectVendor', 'injectAppSources'));

gulp.task('mockserver', ['jsonserver', 'webserver']);
