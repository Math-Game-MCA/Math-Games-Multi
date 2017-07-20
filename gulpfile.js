var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    jade        = require('gulp-jade'),
    less        = require('gulp-less'),
    path        = require('path'),
    livereload  = require('gulp-livereload'), // Livereload plugin needed: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
    marked      = require('marked'), // For :markdown filter in jade
    path        = require('path'),
    changed     = require('gulp-changed'),
    prettify    = require('gulp-html-prettify'),
    w3cjs       = require('gulp-w3cjs'),
    rename      = require('gulp-rename'),
    flip        = require('css-flip'),
    through     = require('through2'),
    gutil       = require('gulp-util'),
    htmlify     = require('gulp-angular-htmlify'),
    minifyCSS   = require('gulp-minify-css'),
    gulpFilter  = require('gulp-filter'),
    expect      = require('gulp-expect-file'),
    gulpsync    = require('gulp-sync')(gulp),
    ngAnnotate  = require('gulp-ng-annotate'),
    sourcemaps  = require('gulp-sourcemaps'),
    replace = require('gulp-replace');
    PluginError = gutil.PluginError;

// LiveReload port. Change it only if there's a conflict
var lvr_port = 35727;

var W3C_OPTIONS = {
  // Set here your local validator if your using one. leave it empty if not
  //uri: 'http://validator/check',
  doctype: 'HTML5',
  output: 'json',
  // Remove some messages that angular will always display.
  filter: function(message) {
    if( /Element head is missing a required instance of child element title/.test(message) )
      return false;
    if( /Attribute .+ not allowed on element .+ at this point/.test(message) )
      return false;
    if( /Element .+ not allowed as child of element .+ in this context/.test(message) )
      return false;
    if(/Comments seen before doctype./.test(message))
      return false;
  }
};

// production mode (see build task)
var isProduction = false;
var useSourceMaps = false;

// ignore everything that begins with underscore
var hidden_files = '**/_*.*';
var ignored_files = '!'+hidden_files;

// VENDOR CONFIG
var vendor = {
  // vendor scripts required to start the app
  base: {
    source: require('./vendor.base.json'),
    dest: './assets/js',
    name: 'base.js'
  },
  // vendor scripts to make to app work. Usually via lazy loading
  app: {
    source: require('./vendor.json'),
    dest: './vendor'
  }
};

// SOURCES CONFIG 
var source = {
  scripts: {
    app:    [ 'front-generator/extra-js/canvasjs.js',
              'front-generator/js/app.init.js',
              'front-generator/js/modules/*.js',
              'front-generator/js/modules/controllers/*.js',
              'front-generator/js/modules/directives/*.js',
              'front-generator/js/modules/services/*.js',
              'front-generator/js/modules/filters/*.js',
              'front-generator/js/custom/**/*.js'
            ],
    watch: ['front-generator/js/**/*.js']
  },
  /*templates: {
    app: {
        files : ['jade/index.jade'],
        watch: ['jade/index.jade', hidden_files]
    },
    views: {
        files : ['jade/views/*.jade', 'jade/views/**\/*.jade', ignored_files],
        watch: ['jade/views/**\/*.jade']
    },
    pages: {
        files : ['jade/pages/*.jade'],
        watch: ['jade/pages/*.jade']
    }
  },*/
  templates: {
    app: {
        files : ['front-generator/html/index.html'],
        watch: ['front-generator/html/index.html', hidden_files]
    },
    views: {
        files : ['front-generator/html/views/*.html', 'front-generator/html/views/**/*.html', ignored_files],
        watch: ['front-generator/html/views/**/*.html']
    },
    pages: {
        files : ['front-generator/html/pages/*.html'],
        watch: ['front-generator/html/pages/*.html']
    }
  },
  styles: {
    app: {
      main: ['front-generator/less/app.less', '!front-generator/less/themes/*.less'],
      dir:  'front-generator/less',
      watch: ['front-generator/less/*.less', 'front-generator/less/**/*.less', '!front-generator/less/themes/*.less']
    },
    themes: {
      main: ['front-generator/less/themes/*.less', ignored_files],
      dir:  'front-generator/less/themes',
      watch: ['front-generator/less/themes/*.less']
    },
  },
  bootstrap: {
    main: 'front-generator/less/bootstrap/bootstrap.less',
    dir:  'front-generator/less/bootstrap',
    watch: ['front-generator/less/bootstrap/*.less']
  }
};

// BUILD TARGET CONFIG 
var build = {
  scripts: {
    app: {
      main: 'app.js',
      dir: 'assets/js'
    }
  },
  styles: 'assets/css',
  templates: {
    app: '.',
    views: 'assets/templates/views',
    pages: 'assets/templates/pages'
  }
};



//---------------
// TASKS
//---------------


// JS APP
gulp.task('scripts:app', function() {
    var dte = new Date().getTime();
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(source.scripts.app)
        .pipe( useSourceMaps ? sourcemaps.init() : gutil.noop())
        .pipe(concat(build.scripts.app.main))
        .pipe(ngAnnotate())
        .on("error", handleError)
        .pipe( isProduction ? uglify({preserveComments:'some'}) : gutil.noop() )
        .on("error", handleError)
        .pipe( useSourceMaps ? sourcemaps.write() : gutil.noop() )
        .pipe(replace('{{{currentVersion}}}', dte))
        .pipe(gulp.dest(build.scripts.app.dir));
});


// VENDOR BUILD
gulp.task('scripts:vendor', ['scripts:vendor:base', 'scripts:vendor:app']);

//  This will be included vendor files statically
gulp.task('scripts:vendor:base', function() {

    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(vendor.base.source)
        .pipe(expect(vendor.base.source))
        .pipe(uglify())
        .pipe(concat(vendor.base.name))
        .pipe(gulp.dest(vendor.base.dest))
        ;
});

// copy file from bower folder into the app vendor folder
gulp.task('scripts:vendor:app', function() {
  
  var jsFilter = gulpFilter('**/*.js');
  var cssFilter = gulpFilter('**/*.css');

  return gulp.src(vendor.app.source, {base: 'bower_components'})
      .pipe(expect(vendor.app.source))
      .pipe(jsFilter)
      .pipe(uglify())
      .pipe(jsFilter.restore())
      .pipe(cssFilter)
      .pipe(minifyCSS())
      .pipe(cssFilter.restore())
      .pipe( gulp.dest(vendor.app.dest) );

});

// APP LESS
gulp.task('styles:app', function() {
    return gulp.src(source.styles.app.main)
        .pipe( useSourceMaps ? sourcemaps.init() : gutil.noop())
        .pipe(less({
            paths: [source.styles.app.dir]
        }))
        .on("error", handleError)
        .pipe( isProduction ? minifyCSS() : gutil.noop() )
        .pipe( useSourceMaps ? sourcemaps.write() : gutil.noop())
        .pipe(gulp.dest(build.styles));
});

// APP RTL
gulp.task('styles:app:rtl', function() {
    return gulp.src(source.styles.app.main)
        .pipe( useSourceMaps ? sourcemaps.init() : gutil.noop())
        .pipe(less({
            paths: [source.styles.app.dir]
        }))
        .on("error", handleError)
        .pipe(flipcss())
        .pipe( isProduction ? minifyCSS() : gutil.noop() )
        .pipe( useSourceMaps ? sourcemaps.write() : gutil.noop())
        .pipe(rename(function(path) {
            path.basename += "-rtl";
            return path;
        }))
        .pipe(gulp.dest(build.styles));
});

gulp.task('styles:style', function() {
    console.log('-----------------------');
    console.log(source.styles.app.main);
    console.log(source.styles.app.dir);
    console.log('#-----------------------#');
    return gulp.src(source.styles.app.main)
        .pipe( useSourceMaps ? sourcemaps.init() : gutil.noop())
        .pipe(less({
            paths: [source.styles.app.dir]
        }))
        .on("error", handleError)
        .pipe(flipcss())
        .pipe( isProduction ? minifyCSS() : gutil.noop() )
        .pipe( useSourceMaps ? sourcemaps.write() : gutil.noop())
        .pipe(rename(function(path) {
            console.log('+-----------------------+');
            console.log(path.basename);
            path.basename += "-rtl";
            console.log('_-----------------------_');
            return path;
        }))
        .pipe(gulp.dest(build.styles));
});

// LESS THEMES
gulp.task('styles:themes', function() {
    return gulp.src(source.styles.themes.main)
        .pipe(less({
            paths: [source.styles.themes.dir]
        }))
        .on("error", handleError)
        .pipe(gulp.dest(build.styles));
});

// BOOSTRAP
gulp.task('bootstrap', function() {
    return gulp.src(source.bootstrap.main)
        .pipe(less({
            paths: [source.bootstrap.dir]
        }))
        .on("error", handleError)
        .pipe(gulp.dest(build.styles));
});

// JADE
gulp.task('templates:app', function() {
    return gulp.src(source.templates.app.files)
        //.pipe(changed(build.templates.app, { extension: '.html' }))
        //.pipe(jade())
        //.on("error", handleError)
        //.pipe(prettify({
          //  indent_char: ' ',
        //    indent_size: 3,
        //    unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u']
        //}))
        // .pipe(htmlify({
        //     customPrefixes: ['ui-']
        // }))
        // .pipe(w3cjs( W3C_OPTIONS ))
        .pipe(gulp.dest(build.templates.app))
        ;
});

// JADE
gulp.task('templates:pages', function() {
    return gulp.src(source.templates.pages.files)
        //.pipe(changed(build.templates.pages, { extension: '.html' }))
        //.pipe(jade())
        //.on("error", handleError)
        //.pipe(prettify({
        //    indent_char: ' ',
        //    indent_size: 3,
        //    unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u']
        //}))
        // .pipe(htmlify({
        //     customPrefixes: ['ui-']
        // }))
        // .pipe(w3cjs( W3C_OPTIONS ))
        .pipe(gulp.dest(build.templates.pages))
        ;
});

// JADE
gulp.task('templates:views', function() {
    return gulp.src(source.templates.views.files)
        //.pipe(changed(build.templates.views, { extension: '.html' }))
        //.pipe(jade())
        //.on("error", handleError)
        //.pipe(prettify({
        //    indent_char: ' ',
        //    indent_size: 3,
        //    unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u']
        //}))
        // .pipe(htmlify({
        //     customPrefixes: ['ui-']
        // }))
        // .pipe(w3cjs( W3C_OPTIONS ))
        .pipe(gulp.dest(build.templates.views))
        ;
});

gulp.task('version', function(){
  var dte = new Date().getTime();
  gutil.log(gutil.colors.cyan('*******Anurag-Pal*****'));
  /* gulp.src([build.scripts.app.dir + '/' +build.scripts.app.main])
    .pipe(replace('{{{currentVersion}}}', dte))
    .pipe(gulp.dest(build.scripts.app.dir)); */
});

//---------------
// WATCH
//---------------

// Rerun the task when a file changes
gulp.task('watch', function() {
  livereload.listen();

  gulp.watch(source.scripts.watch,           ['scripts:app', 'version']);
  gulp.watch(source.styles.app.watch,        ['styles:app', 'styles:app:rtl']);
  gulp.watch(source.styles.themes.watch,     ['styles:themes']);
  gulp.watch(source.bootstrap.watch,         ['styles:app']); //bootstrap
  gulp.watch(source.templates.pages.watch,   ['templates:pages']);
  gulp.watch(source.templates.views.watch,   ['templates:views']);
  gulp.watch(source.templates.app.watch,     ['templates:app']);

  gulp.watch([

      'assets/**'

  ]).on('change', function(event) {

      livereload.changed( event.path );

  });

});


//---------------
// DEFAULT TASK
//---------------


// build for production (minify)
gulp.task('build', ['prod', 'default']);
gulp.task('prod', function() { isProduction = true; });

// build with sourcemaps (no minify)
gulp.task('sourcemaps', ['usesources', 'default']);
gulp.task('usesources', function(){ useSourceMaps = true; });

// default (no minify)
gulp.task('default', gulpsync.sync([
          'scripts:vendor',
          'scripts:app',
          'start',
          'version'
        ]), function(){

  gutil.log(gutil.colors.cyan('************'));
  gutil.log(gutil.colors.cyan('* All Done *'), 'You can start editing your code, LiveReload will update your browser after any change..');
  gutil.log(gutil.colors.cyan('************'));

});

gulp.task('start',[
          'styles:app',
          'styles:app:rtl',
          'styles:themes',
          'templates:app',
          'templates:pages',
          'templates:views',
          'watch'
        ]);

gulp.task('done', function(){
  console.log('All Done!! You can start editing your code, LiveReload will update your browser after any change..');
});

// Error handler
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

// Mini gulp plugin to flip css (rtl)
function flipcss(opt) {
  
  if (!opt) opt = {};

  // creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, cb) {
    if(file.isNull()) return cb(null, file);

    if(file.isStream()) {
        console.log("todo: isStream!");
    }

    var flippedCss = flip(String(file.contents), opt);
    file.contents = new Buffer(flippedCss);
    cb(null, file);
  });

  // returning the file stream
  return stream;
}