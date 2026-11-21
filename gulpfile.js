const { src, dest, series, parallel, watch } = require('gulp');
const fs = require('fs');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const fileInclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();

const isProd = process.argv.includes('build');

const paths = {
  html: 'src/**/*.html',
  htmlEntry: 'src/*.html',
  scss: 'src/scss/**/*.scss',
  js: 'src/js/**/*.js',
  img: 'src/img/**/*',
  dist: 'dist'
};

function clean(cb) {
  fs.rmSync(paths.dist, { recursive: true, force: true });
  cb();
}

function html() {
  return src(paths.htmlEntry)
    .pipe(fileInclude({ prefix: '@@', basepath: 'src' }))
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true, minifyJS: true }))
    .pipe(dest(paths.dist))
    .pipe(browserSync.stream());
}

function styles() {
  const plugins = [autoprefixer()];
  if (isProd) plugins.push(cssnano());
  return src('src/scss/main.scss', { sourcemaps: !isProd })
    .pipe(sass({ quietDeps: true }).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(dest(`${paths.dist}/css`, { sourcemaps: '.' }))
    .pipe(browserSync.stream());
}

// Bootstrap bundle (Popper included) + our script -> one file
function scripts() {
  const files = [
    'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    'src/js/main.js'
  ];
  let stream = src(files, { sourcemaps: !isProd }).pipe(concat('app.js'));
  if (isProd) stream = stream.pipe(terser());
  return stream.pipe(dest(`${paths.dist}/js`, { sourcemaps: '.' })).pipe(browserSync.stream());
}

// Bootstrap CSS + Bootstrap Icons (css + font files) served locally
const vendor = parallel(
  function bootstrapCss() {
    return src('node_modules/bootstrap/dist/css/bootstrap.min.css').pipe(dest(`${paths.dist}/vendor/bootstrap`));
  },
  function iconsCss() {
    return src('node_modules/bootstrap-icons/font/bootstrap-icons.min.css').pipe(dest(`${paths.dist}/vendor/bootstrap-icons`));
  },
  function iconsFonts() {
    return src('node_modules/bootstrap-icons/font/fonts/*', { encoding: false }).pipe(dest(`${paths.dist}/vendor/bootstrap-icons/fonts`));
  }
);

function images() {
  return src(paths.img, { encoding: false, allowEmpty: true }).pipe(dest(`${paths.dist}/img`));
}

function serve(cb) {
  browserSync.init({ server: paths.dist, port: 3000, notify: false });
  watch(paths.html, html);
  watch(paths.scss, styles);
  watch(paths.js, scripts);
  watch(paths.img, images);
  cb();
}

const build = series(clean, parallel(html, styles, scripts, vendor, images));

exports.clean = clean;
exports.build = build;
exports.default = series(build, serve);
