const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const open = require('open');

const app = {
  srcPath: 'app/',
  devPath: 'tmp/',
  prdPath: 'dist/'
};

const JS_LIBS = [
  'node_modules/angular-ui-router/release/angular-ui-router.js',
  'node_modules/oclazyload/dist/ocLazyLoad.min.js',
  'node_modules/angular-loading-bar/build/loading-bar.min.js',
  'node_modules/angular-bootstrap/ui-bootstrap-tpls.min.js',
  'node_modules/moment/moment.js',
  'node_modules/angular-date-time-input/src/dateTimeInput.js',
  'node_modules/angularjs-bootstrap-datetimepicker/src/js/datetimepicker.js',
  'node_modules/angular-table-resize/dist/angular-table-resize.min.js',
  'node_modules/angular-clipboard/angular-clipboard.js',
  'node_modules/selectize/dist/js/standalone/selectize.js',
  'node_modules/angular-selectize2/dist/selectize.js',
  'node_modules/bootstrap-switch/dist/js/bootstrap-switch.min.js',
  'node_modules/ng-dialog/js/ngDialog.js',
  'node_modules/angular-ui-notification/dist/angular-ui-notification.min.js',
  'node_modules/angular-utils-pagination/dirPagination.js',
  'app/scripts/libs/treeTable.js',
];

const CSS_APP = [
  'node_modules/angular-loading-bar/build/loading-bar.min.css',
  'node_modules/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css',
  'node_modules/ng-dialog/css/ngDialog.min.css',
  'node_modules/ng-dialog/css/ngDialog-theme-default.css',
  'node_modules/angularjs-bootstrap-datetimepicker/src/css/datetimepicker.css',
  'node_modules/angular-ui-notification/dist/angular-ui-notification.min.css',
  'node_modules/angular-table-resize/dist/angular-table-resize.css',
  'node_modules/selectize/dist/css/selectize.css',
  'app/styles/page.css',
  'app/styles/timeline.css',
  'app/styles/main.css'
];

const JS_APP = [
  'app/scripts/app.js',
  'app/scripts/filters/filters.js',
  'app/scripts/services/version_service.js',
  'app/scripts/services/auth_service.js',
  'app/scripts/services/appservice.js',
  'app/scripts/services/flow_service_v1.js',
  'app/scripts/services/flow_service_v2.js',
  'app/scripts/services/degrade_service.js',
  'app/scripts/services/systemservice.js',
  'app/scripts/services/machineservice.js',
  'app/scripts/services/identityservice.js',
  'app/scripts/services/metricservice.js',
  'app/scripts/services/param_flow_service.js',
  'app/scripts/services/authority_service.js',
  'app/scripts/services/cluster_state_service.js',
  'app/scripts/services/gateway/api_service.js',
  'app/scripts/services/gateway/flow_service.js',
];

function lib() {
  return gulp.src(JS_LIBS)
    .pipe(plugins.concat('app.vendor.js'))
    .pipe(gulp.dest(app.devPath + 'js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(app.prdPath + 'js'))
    .pipe(plugins.connect.reload());
}

function css() {
  return gulp.src(CSS_APP)
    .pipe(plugins.concat('app.css'))
    .pipe(gulp.dest(app.devPath + 'css'))
    .pipe(plugins.cssmin())
    .pipe(gulp.dest(app.prdPath + 'css'))
    .pipe(plugins.connect.reload());
}

function js() {
  return gulp.src(JS_APP)
    .pipe(plugins.concat('app.js'))
    .pipe(gulp.dest(app.devPath + 'js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(app.prdPath + 'js'))
    .pipe(plugins.connect.reload());
}

function jshint() {
  return gulp.src(JS_APP)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter());
}

function clean() {
  return gulp.src([app.devPath, app.prdPath], { allowEmpty: true })
    .pipe(plugins.clean());
}

function serve(cb) {
  plugins.connect.server({
    root: [app.devPath],
    livereload: true,
    port: 1234
  });

  setTimeout(() => {
    open('http://localhost:8858/index_dev.htm')
  }, 200);

  // 监听文件变化
  gulp.watch(app.srcPath + '**/*.js', js);
  gulp.watch(app.srcPath + '**/*.css', css);
  
  cb();
}

// 导出任务
exports.lib = lib;
exports.css = css;
exports.js = js;
exports.jshint = jshint;
exports.clean = clean;
exports.serve = serve;

// 定义复合任务
const build = gulp.series(clean, jshint, gulp.parallel(lib, js, css));
exports.build = build;

// 定义默认任务
exports.default = gulp.series(build, serve);
