/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2022-05-13 22:01:27
 * @version $Id$
 */

const { src, dest, watch, series, parallel} = require('gulp');
const uglify = require('gulp-uglify')
const clean  = require('gulp-clean')
const merge  = require('merge-stream')
const less   = require('gulp-less');
const cssmin = require('gulp-minify-css')
const tingpng = require('gulp-tinypng')
const jsonmin = require('gulp-jsonminify')
var gulp = require('gulp')
var htmlmin = require('gulp-htmlmin')

const files = {
  jsPath: 'src/sys/js/*.js'
}

const cleanTask =()=> {
  return src('dist/.', { read: false })
    .pipe(clean())
}

const jsTask =()=> {
  return merge(['lib/jquery','lib/jsrender','sys/js'].map(item=>{
    return src(`src/${item}/*.js`)
               .pipe(uglify())
               .pipe(dest(`dist/${item}/`))
  }))
}

const cssTask =()=> {
  return merge(['lib/jquery','sys/css'].map(item=>{
    return src([`src/${item}/*.less`,`src/${item}/*.css`])
      .pipe(less())
      .pipe(cssmin())
      .pipe(dest(`dist/${item}/`))
  }))
}

const jsonTask =()=> {
  return src('src/data/*.json')
             .pipe(jsonmin())
             .pipe(dest('dist/data'))
}

const imgTask =()=> {
  return src('src/img/*.*')
      .pipe(tingpng('CqxyKzqBgv4GxHZD2nlVdVQhy9vt0zNF'))
      .pipe(dest('dist/img'))
}

gulp.task('testHtmlmin',function(){
  var options = {
    removeComments:true,
    collapseWhitespace:true,
    collapseBooleanAttributes:true,
    removeEmptyAttributes:true,
    removeScriptTypeAttributes:true,
    removeStyleLinkTypeAttributes:true,
    minifyJS:true,
    minifyCSS:true,
  };
  gulp.src('src/*.html')
      .pipe(htmlmin(options))
      .pipe(gulp.dest('dist/html'));
});

gulp.task('testTmplmin',function(){
  var options = {
    removeComments:true,
    collapseWhitespace:true,
    collapseBooleanAttributes:true,
    removeEmptyAttributes:true,
    removeScriptTypeAttributes:true,
    removeStyleLinkTypeAttributes:true,
    minifyJS:true,
    minifyCSS:true,
  };
  gulp.src('src/tmpl/*.tmpl')
      .pipe(htmlmin(options))
      .pipe(gulp.dest('dist/tmpl'));
});


exports.default = series(
  cleanTask,
  parallel(
    jsTask,
    cssTask,
    jsonTask,
    imgTask,
  )
)