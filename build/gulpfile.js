/*
 * 2016/04/12 重构版本
 * By Reeoo
 *
 * 如果你的gulp版本号低于3.9，在package.json文件里面更新你的gulp，然后运行下面的更新命令：
 * npm install && npm install gulp -g
 *
 * */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins');
var yargs = require('yargs');
var runsequence = require('run-sequence');
var seajsCombo = require('./build.engine');
var version = '000000000';
var basePath = '../web/';
var channel = 'version';
//var libFile = require(basePath + 'blade/lib.json');
//var coreFile = require(basePath + 'blade/core.json');
//var cssFile = require(basePath + 'blade/static/css/css.json');
var fs = require('fs');
var tasks = ['start', 'clean', 'copy', 'htmlmin', 'imgmin', 'jsmin', 'cssmin', 'cssRev', /*'replaceVersion', 'comboCore', 'comboPages', 'htmlReplace'*/];
var taskSequence = null;
var watches = [];
var curPath = '';
var ignore = [
    'libs',
    'moudule',
    'ui',
    'view',
];
var $ = plugins({
        pattern: ['gulp-*', 'imagemin-pngquant', 'browser-sync'],
        replaceString: /\bgulp[\-.]/,
        lazy: true,
        camelize: true
    }),
    isAdvance = yargs.argv.advance || 0,
    isProduct = yargs.argv.product || 0,
    isOnlineProduct = !!isProduct,


    isOnlineTest = !!isAdvance,
    isDebug = !(isOnlineTest || isOnlineProduct),
    isRelease = (isOnlineTest || isOnlineProduct),
    watchTasks = [],
    watchTasks2 = [],
    releaseTasks = [],
    headerReplace = [

        '<meta charset="UTF-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui" />',
        '<meta content="yes" name="apple-mobile-web-app-capable" />',
        '<meta content="black" name="apple-mobile-web-app-status-bar-style" />',
        '<meta name="format-detection" content="telephone=no" />',
        '<meta name="full-screen" content="yes">',
        '<meta name="browsermode" content="application">',
        '<meta name="x5-fullscreen" content="true">',
        '<meta name="x5-page-mode" content="app">',
        '<meta name="renderer" content="webkit">',
        '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
        '<meta name="description" content="描述文字">',
        '<meta http-equiv="Pragma" content="no-cache">',
        '<meta http-equiv="Cache-Control" content="no-cache">',
        '<meta http-equiv="x-dns-prefetch-control" content="on" />',
        '<meta http-equiv="Expires" content="0">',
        '<meta name="keywords" content="关键字">',
        '<link rel="icon" href="favicon.ico" type="image/x-icon" />',
        '<link rel=dns-prefetch href="http://js.cdn.cn/" >',
        '<link rel=dns-prefetch href="http://css.cdn.cn/" >'
    ],
    footerReplace = [

    ],
    bodyReplace = [

    ],
    jsPrefix = '',
    cssPrefix = '',
    imgPrefix = '';

var buildFilePath = "../build_artifacts/web",//构建目录
    buildProjectPath = buildFilePath + '/' + channel,
    taskConfigs = {
        clean: {
            handler: 'clean',
            src: buildFilePath
        },
        copy: {
            handler: 'copy',
            src: [basePath + '/**/*'],
            dest: buildFilePath
        },
        htmlmin: {
            handler: 'htmlmin',
            src: [basePath + channel + '/**/*.html'],
            dest: buildProjectPath
        },
        cssmin: {
            handler: 'cssmin',
            src: [basePath + channel + '/**/*.css'],
            dest: buildProjectPath
        },
        cssRev: {
            handler: 'cssRev',
            src: [buildProjectPath + '/static/css/*.css'],
            dest: buildProjectPath + '/static/css'
        },
        imgmin: {
            handler: 'imgmin',
            src: [basePath + channel + "/**/*.jpg", basePath + channel + "/**/*.png", basePath + channel + "/**/*.gif"],
            dest: buildProjectPath
        },
        jsmin: {
            handler: 'jsmin',
            src: [basePath + channel + '/**/*.js'],
            dest: buildProjectPath
        },
        // comboCore: {
        //     handler: 'comboCore',
        //     src: [buildProjectPath + '/build.js', buildProjectPath + '/main.js'],
        //     dest: buildProjectPath + '/'
        // },
        // comboPages: {
        //     handler: 'comboPages',
        //     src: [buildProjectPath + '/pages/**/*.js'],
        //     dest: buildProjectPath + '/pages/'
        // },
        htmlReplace: {
            handler: 'htmlReplace',
            src: [buildProjectPath + '/**/*.html'],
            dest: buildProjectPath
        },
        // replaceVersion: {
        //     handler: 'replaceVersion',
        //     src: [buildProjectPath + '/seajs.config.js'],
        //     dest: buildProjectPath
        // }
    },
    taskHandler = {
        // 复制文件
        copy(settings) {
            return gulp.src(settings.src)
                .pipe(gulp.dest(settings.dest))
        },
        replaceVersion(settings) {
            return gulp.src(settings.src)
                .pipe($.replace(/__VERSION__/gi, version))
                .pipe(gulp.dest(settings.dest))
        },
        comboCore(settings) {
            return gulp.src(settings.src)
                .pipe(seajsCombo({
                    base: 'webapp',
                    ignore: ignore,
                    configFile: buildProjectPath + '/seajs.config.js',
                    plugins: [{
                        ext: ['.html', '.css'],
                        use: [{
                            plugin: $.wrap,
                            param: ["define(function(){return '<%= contents %>'});"]
                        }]
                    }]
                }))
                .pipe($.concat('main.js'))
                .pipe($.replace(/\.\s*seajs\.use|(?:^|[^$])\bseajs\.use\s*\((.+)/g, function (match) {
                    match = match.replace('/*', '').replace('*/', '');
                    return ' /*' + match + '*/';
                }))
                .pipe($.rev())
                .pipe(gulp.dest(settings.dest))
                .pipe($.rev.manifest('main.json'))
                .pipe(gulp.dest(settings.dest))
        },
        comboPages(settings) {
            return gulp.src(settings.src)
                .pipe(seajsCombo({
                    base: 'webapp',
                    ignore: ignore.concat(['TrainModel', 'TrainStore']),
                    configFile: buildProjectPath + '/seajs.config.js',
                    plugins: [{
                        ext: ['.html', '.css'],
                        use: [{
                            plugin: $.wrap,
                            param: ["define(function(){return '<%= contents %>'});"]
                        }]
                    }]
                }))
                .pipe(gulp.dest(settings.dest))
                .pipe($.rename(function (path) {
                    path.basename += '.' + version;
                    return path;
                }))
                .pipe(gulp.dest(settings.dest))
        },
        //构建目录清理
        clean(settings) {
            return gulp.src(settings.src)
                .pipe($.clean({
                    read: false,
                    force: true
                }))
        },
        //图片压缩
        imgmin(settings) {
            return gulp.src(settings.src)
                .pipe(gulp.dest(settings.dest))
        },
        //js压缩
        jsmin(settings) {
            return gulp.src(settings.src)
                .pipe($.if(isRelease, $.uglify({
                    mangle: false
                })))
                .on('error', function (e) {
                    console.log(e);
                })
                .pipe($.replace(/__JS__/gi, jsPrefix))
                .pipe($.replace(/__STYLE__/gi, cssPrefix))
                .pipe($.replace(/__IMG__/gi, imgPrefix))
                .pipe(gulp.dest(settings.dest))
        },
        cssmin(settings) {
            return gulp.src(settings.src)
                .pipe($.replace(/__IMG__/gi, imgPrefix))
                .pipe($.minifyCss())
                .pipe($.replace(/[\r\n\t]+/g, ' '))
                .pipe($.replace(/^.*$/, function (m) {
                    m = m.replace(/'/g, "\\'")
                    return m;
                }))
                .pipe(gulp.dest(settings.dest))
        },
        cssRev(settings) {
            return gulp.src(settings.src)
                .pipe($.rev())
                .pipe(gulp.dest(settings.dest))
                .pipe($.rev.manifest('traincss.json'))
                .pipe(gulp.dest(settings.dest))
        },
        //html压缩
        htmlmin(settings) {
            return gulp.src(settings.src)
                .pipe($.replace(/__JS__/gi, jsPrefix))
                .pipe($.replace(/__STYLE__/gi, cssPrefix))
                .pipe($.replace(/__IMG__/gi, imgPrefix))
                .pipe($.replace(/[\r\n\t\s]+/gi, ' '))
                .pipe($.replace(/^.*$/, function (m) {
                    m = m.replace(/'/g, "\\'")
                    return m;
                }))
                .pipe(gulp.dest(settings.dest))
        },
        //html替换
        htmlReplace(settings) {
            var mainFile = getFile(buildProjectPath + '/main.json');
            var traincssFile = getFile(buildProjectPath + '/static/css/traincss.json');
            var replaceConfig = getReplaceConfig();
            replaceConfig.tcp=[];
            if (isDebug) {//本地环境
                replaceConfig.header.push(addScript('http://res.wx.qq.com/open/js/jweixin-1.0.0.js'));
                replaceConfig.footer.push(addScript('/web/js/' + mainFile['main.js']));
            } else if(isOnlineTest){//测试环境
                console.log("isOnlineTest")
            } else if(isOnlineProduct){//正式环境
                console.log("isOnlineProduct")
            }
            return gulp.src(settings.src)
                .pipe($.replace(/<!--_HEADER_-->/gi, replaceConfig.header.join('')))
                .pipe($.replace(/<!--_BODY_-->/gi, replaceConfig.body.join('')))
                .pipe($.replace(/<!--_FOOTER_-->/gi, replaceConfig.footer.join('')))
                //.pipe($.replace(/<!--_TG_-->/gi, replaceConfig.tcp.join('')))
                .pipe(gulp.dest(settings.dest))
        }
    };
function getFile(url) {
    var file = fs.readFileSync(url, 'utf-8').replace(/[\r\n\t\s]+/gi, '');
    return JSON.parse(file);
}
function addScript(src) {
    return '<script type="text/javascript" src="' + src + '"></script>';
}
function addStyle(src) {
    return '<link rel="stylesheet" href="' + src + '">';
}

function copyArr(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        result[i] = arr[i];
    }
    return result;
}
function getReplaceConfig() {
    var newObj = {
        header: copyArr(headerReplace),
        footer: copyArr(footerReplace),
        body: copyArr(bodyReplace)
    }
    if (isDebug) {

    }else if(isOnlineTest){//测试环境

    } else if(isOnlineProduct){//正式环境

    }
    newObj.footer.push(addScript(''));
    return newObj
}


// 注册任务
for (var taskName in taskConfigs) {
    (function (settings) {
        gulp.task(taskName, function () {
            return taskHandler[settings.handler](settings);
        });
        releaseTasks.push(taskName);
    })(taskConfigs[taskName]);
}

if (!isDebug || isAdvance || isProduct) {
    taskSequence = $.sequence.apply(this, tasks);
} else {
    taskSequence = $.sequence.apply(this, tasks.concat(['server', 'watchListener']));
}
gulp.task('watchTask', function (callback) {
    runsequence('start','clean', 'copy', 'htmlmin', 'imgmin', 'jsmin', 'cssmin', 'cssRev', /*'replaceVersion', 'comboCore', 'comboPages', 'htmlReplace',*/ callback);
    return;
});
gulp.task('watch', ['watchTask'], function () {
    $.browserSync.reload(curPath);
})

gulp.task('watchListener', () => {
    var watcher = gulp.watch(basePath  + '/**/*', ['watch']);
    watcher.on('change', (path) => {
        curPath = path;
    })
})


gulp.task('server', () => {
    //静态服务器
    $.browserSync({
        server: {
            baseDir: '../build_artifacts/',
        },
        ui: false,
        //YT 配置https
        //https: true,
        port: '3000',
        startPath: "../web/index.html",
    });
})
gulp.task('start',function () {
    var eve = '';
    if(isDebug){
        eve = 'gulp命令,本地调试环境打包并拉起服务'
    }
    if(isAdvance) {
        eve = 'gulp --advance命令,线上测试环境打包'
    }
    if(isProduct){
        eve = 'gulp --product命令,线上正式环境打包'
    }
    console.log("当前执行"+ eve)
})

gulp.task('default', taskSequence);


