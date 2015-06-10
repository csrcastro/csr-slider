var gulp = require('gulp'),
	connect = require('gulp-connect');


gulp.task('connect', function() {
  connect.server({
    root: 'app',
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src('./app/scripts/**/*.js')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
  gulp.watch(['./app/scripts/**/*.js'], ['js']);
});


//gulp.task('default', ['watch']);
gulp.task('dev', ['connect','watch']);