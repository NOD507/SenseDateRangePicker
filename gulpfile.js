/* global require process Buffer */
var gulp = require('gulp');
var cssnano = require('gulp-cssnano');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var saveLicense = require('uglify-save-license');
var pkg = require('./package.json');

var DIST = './dist',
	SRC = './src',
	NAME = pkg.name,
	VERSION = process.env.VERSION || 'local-dev';

gulp.task('qext', function () {
	var qext = {
		name: 'Date picker',
		type: 'visualization',
		description: pkg.description + '\nVersion: ' + VERSION,
		version: VERSION,
		icon: 'calendar',
		preview: 'preview.png',
		keywords: 'qlik-sense, visualization',
		author: pkg.author,
		homepage: pkg.homepage,
		license: pkg.license,
		repository: pkg.repository,
		installer: 'QlikExtensionBundler',
		bundle: {
			id: 'qlik-dashboard-bundle',
			name: 'Qlik Dashboard bundle',
			description: 'This is a set of supported extensions that will facilitate dashboard creation in Qlik Sense: A navigation button, a date picker, a slider, a demand-reporting button, a share button and two different container objects. These can be used in addition to the native objects found under "Charts".\n\nFor limitations and support conditions, see the documentation.'
		},
		dependencies: {
			'qlik-sense': '>=5.5.x'
		}
	};
	if (pkg.contributors) {
		qext.contributors = pkg.contributors;
	}
	var src = require('stream').Readable({
		objectMode: true
	});
	src._read = function () {
		this.push(new gutil.File({
			cwd: '',
			base: '',
			path: NAME + '.qext',
			contents: Buffer.from(JSON.stringify(qext, null, 4))
		}));
		this.push(null);
	};
	return src.pipe(gulp.dest(DIST));
});

gulp.task('clean', function (ready) {
	var del = require('del');
	del.sync([DIST]);
	ready();
});

gulp.task('less', function () {
	var less = require('gulp-less');
	var LessPluginAutoPrefix = require('less-plugin-autoprefix');
	var autoprefix = new LessPluginAutoPrefix({
		browsers: ['last 2 versions']
	});
	return gulp.src(SRC + '/**/*.less')
		.pipe(less({
			plugins: [autoprefix]
		}))
		.pipe(cssnano())
		.pipe(gulp.dest(DIST));
});
gulp.task('css', function (){
    return gulp.src(SRC + '/**/*.css')
        .pipe(cssnano())
        .pipe(gulp.dest(DIST));
});

gulp.task('build',['clean', 'qext', 'less'], function () {
    gulp.src([
        SRC + '/**/*.png',
        SRC + '/**/*.txt'
    ])
		.pipe(gulp.dest(DIST));

	return gulp.src(SRC + '/**/*.js')
		.pipe(uglify({
			mangle:false,
			output:{
				comments: saveLicense
			}
		}))
		.pipe(gulp.dest(DIST));
});

gulp.task('zip', ['build'], function () {
	var zip = require('gulp-zip');

	return gulp.src(DIST + '/**/*')
		.pipe(zip(`${NAME}_${VERSION}.zip`))
		.pipe(gulp.dest(DIST));
});

gulp.task('default', ['build']);