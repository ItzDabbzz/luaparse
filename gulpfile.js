/* globals require: true */
const gulp = require('gulp');
const header = require('gulp-header');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const { Buffer } = require('node:buffer');
const jshint = require('gulp-jshint');
const addsrc = require('gulp-add-src');
const pkg = require('./package.json');
const banner = [
      '/*!'
    , ' * @license'
    , ' * <%= pkg.name %> <%= pkg.version %> <%= pkg.homepage %>'
    , ' * Copyright 2012-<%= new Date().getFullYear() %> <%= pkg.author %>'
    , ' * MIT license'
    , ' */'
    , ''
  ].join('\n');

const striphtml = (() => {

  const PluginError = require('plugin-error');
  const through = require('through2');

  function removeHTML(src, _patterns) {
    const lines = src.split('\n');
    let scriptSection = false;
    let commentingSection = false;

    lines.forEach((line, i) => {
      const starts = (/<script/i).test(line);
      const stops = (/<\/script/i).test(line);
      const commentStart = (/<!--/).test(line);
      const commentStop = (/-->/).test(line);

      if (starts && !(starts && stops)) {
        const type = line.match(/<script[^>]*type=['"]?([^\s"']*)[^>]*>/i);
        scriptSection = (type === null || type[1] === 'text/javascript');
        lines[i] = '';
      } else if (stops) {
        scriptSection = false;
      }

      if(!scriptSection && commentStart){
        commentingSection = true;
      }

      if (!scriptSection || commentingSection) {
        lines[i] = '';
      }

      if(commentStop){
        commentingSection = false;
      }
    });

    return lines.join('\n');
  }

  return () => through.obj(function processContent(file, _enc, cb) {
      if (file.isNull()) {
        cb(null, file);
        return;
      }
      if (file.isStream()) {
        cb(new PluginError('gulp-striphtml', 'Streaming not supported'));
        return;
      }

      const res = removeHTML(file.contents.toString());
      file.contents = new Buffer(res);
      this.push(file);
      cb();
    });
})();

gulp.task('build', () => gulp.src('luaparse.js')
    .pipe(header(banner, { pkg : pkg  } ))
    .pipe(gulp.dest('dist'))
    .pipe(uglify({ output: { comments: /^!|@preserve|@license|@cc_on/i } }))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('dist')));

gulp.task('lint', () => gulp.src([
        'examples/**/*.html'
      , 'docs/!(coverage)/*.html'
    ])
    .pipe(striphtml())
    .pipe(addsrc([
        './*.{js,json}'
      , './test/{,spec}/*.js'
      , './{examples,benchmarks}/**/*.{js,json}'
      , '{bin,scripts}/*'
      , '.jshintrc'
    ]))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail')));

gulp.task('version-bump', () => {
  const through = require('through2');

  return gulp.src('luaparse.js')
    .pipe(through.obj(function processContent(file, enc, cb) {
      const data = file.contents.toString();
      file.contents = new Buffer(data.replace(
        /(exports\.version\s*=\s*)(?:'[^']+'|"[^"]+")(;)/, (_, s0, s1) => s0 + JSON.stringify(pkg.version) + s1));
      this.push(file);
      cb();
    }))
    .pipe(gulp.dest('.'));
});
