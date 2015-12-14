var gulp = require('gulp');
var bowtie = require('bowtie-js').gulp;
var browserSync = require('browser-sync').create();
var lib = require('bower-files')();
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var path = require('path');
var del = require('del');

gulp.task('compile-bowtie', function() {
  gulp.src('app/style/*.css')
    .pipe(gulp.dest('dist/style/'));

  return gulp.src('app/*.bow')
    .pipe(bowtie({
      pretty: true,
      locals: {
        title: "Example application"
      }
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('serve', function() {
  browserSync.init(null, {
    port: 7000,
    server: {
      baseDir: 'dist'
    }
  });
});

gulp.task('build-vendors', function() {
  gulp.src(lib.ext('less').files)
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('dist/style/vendors'));

  return gulp.src(lib.ext('js').files)
    .pipe(uglify())
    .pipe(concat('vendors.js'))
    .pipe(gulp.dest('dist/js/vendors'));

});

gulp.task('default', ['compile-bowtie', 'build-vendors', 'serve']);

// Watch for changes on .bow-files and compile
// on change event
gulp.watch('app/*.bow', ['compile-bowtie']);
// Watch for changes on output HTML files and
// reload browser on change event
gulp.watch('dist/**/*.html').on('change', browserSync.reload);
