/*eslint-env node */

var gulp = require('gulp');
// import gulp from 'gulp';
var sass = require('gulp-sass');
// import sass from 'gulp-sass';
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var jasmine = require('gulp-jasmine-phantom');
var concat = require('gulp-concat');
var terser = require('gulp-terser');
var watch = require('gulp-watch');
let build = require('gulp-build');
let errorHandler = require('gulp-error-handle');
let sourcemaps = require('gulp-sourcemaps');
let inject = require('gulp-inject');
let del = require('del');

let paths = {
  src: './src/',
  srcIndex: './src/**/*.html',
  srcScss: './src/sass/**/*.scss',
  srcCss: './src/css/**/*.css',
  srcJs: './src/js/**/*.js',
  srcImg: './src/img_src',

  tmp: './tmp/',
  tmpIndex: './tmp/index.html',
  tmpCss: './tmp/css/',
  tmpJs: './tmp/js/',
  tmpImg: './tmp/img_src',

  dist: './dist/',
  distIndex: './dist/index.html',
  distCss: './dist/css/',
  distCssAll:'./dist/css/**/*.css', 
  distJs: './dist/js/',
  distJsAll:'./dist/js/**/*.js', 
  distImg: './dist/img_src'
};


gulp.task('hello', function(done) {
  console.log("hello world");
  done();
});

// copy all files to temp folder, and inject css/js into html
gulp.task('html', function() {
  return gulp.src(paths.srcIndex).pipe(gulp.dest(paths.tmp));
});

gulp.task('css', function() {
  return gulp.src(paths.srcCss).pipe(gulp.dest(paths.tmpCss));
});

gulp.task('js', function() {
  return gulp.src(paths.srcJs).pipe(gulp.dest(paths.tmpJs));
});

gulp.task('copyTmp', gulp.series('html', 'css', 'js'));

gulp.task('inject', gulp.series('copyTmp'), function() {
  let css = gulp.src(paths.srcCss, {read: false});
  let js = gulp.src(paths.srcJs, {read: false});
  return gulp.src(paths.srcIndex)
    .pipe(inject(css))
    .pipe(inject(js))
    .pipe(gulp.dest(paths.tmp));
});

// // [], gulp.parallel('copy-html', 'copy-images', 'styles', 'lint', 'scripts'), 

gulp.task('watch', function() {
  gulp.watch(paths.src, gulp.series('dist'));
  // gulp.watch('sass/**/*.scss', ['styles']);
  // gulp.watch('js/**/*.js', ['lint']);
  // gulp.watch('./index.html', ['copy-html']);
  // gulp.watch('./dist/index.html').on('change', browserSync.reload);
  // done();
  // browserSync.init({
    // server: './dist'
  // });

});

gulp.task('browsersync', function() {
  browserSync.init({
    ui: {
      port: 9090
    },
    server: './server.js'
  });
});



// gulp.task('scripts', function() {
//   return gulp.src('./js/**/*.js')
//     .pipe(concat('all.js'))
//     .pipe(gulp.dest('./dist/js/'));
// });

gulp.task('scripts-dist', function(done) {
  return gulp.src(paths.srcJs)
    // .pipe(terser())
    .pipe(concat('all.js'))
    .pipe(errorHandler())
    .pipe(gulp.dest('./dist/js/'));
    done();
});

gulp.task('copy-html', function(done) {
  gulp.src(paths.srcIndex)
    .pipe(gulp.dest(paths.dist));
    done();
});

gulp.task('copy-images', function(done) {
  gulp.src(paths.srcImg)
    .pipe(gulp.dest(paths.distImg));
    done();
});

gulp.task('styles', function(done) {
  gulp.src(paths.srcScss)
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest(paths.distCss))
    // .pipe(browserSync.stream());
    done();
});

gulp.task('lint', function () {
  return gulp.src(paths.srcJs)
    // eslint() attaches the lint output to the eslint property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failOnError last.
    .pipe(eslint.failOnError());
});

gulp.task('inject-dist', function() {
  let css = gulp.src(paths.distCssAll);
  let js = gulp.src(paths.distJsAll);
  return gulp.src(paths.distIndex)
    .pipe(inject(css, {relative: true}))
    .pipe(inject(js, {relative: true}))
    .pipe(gulp.dest(paths.dist));
});


gulp.task('sw', function() {
  gulp.src('./sw.js').pipe(gulp.dest('./dist'));
});



gulp.task('clean', function() {
  del(paths.tmp, paths.dist);
});

gulp.task('dist', gulp.series('copy-html','copy-images','styles','scripts-dist', 'inject-dist', 'sw'));
gulp.task('build', gulp.series('inject', 'dist', 'watch'));
// gulp.task('tests', function () {
//   gulp.src('tests/spec/extraSpec.js')
//     .pipe(jasmine({
//       integration: true,
//       vendor: 'js/**/*.js'
//     }));
// });
