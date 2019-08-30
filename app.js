var express = require('express');
// NodeJS中的Path对象，用于处理目录的对象，提高开发效率
var path = require('path');
// 用来定义网页logo的中间件
var favicon = require('serve-favicon');
// NodeJs中Express框架使用morgan中间件记录日志
// Express中的app.js文件已经默认引入了该中间件var logger = require('morgan');
// 使用app.use(logger('dev'));以将请求信息打印在控制台，便于开发调试，
// 但实际生产环境中，需要将日志记录在log文件里
var logger = require('morgan');
// 存储登录信息中间件
var cookieParser = require('cookie-parser');
// 解析请求体的中间件
var bodyParser = require('body-parser');
// 引入模块的js文件
var routes = require('./routes/index');
// var users = require('./routes/user');
//  引入session中间件
var session=require('express-session');
// 创建项目示例
var app = express();

// 引入我们需要的模板
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// 用摩记录请求
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 利用cookieParser中间件存取信息
app.use(cookieParser("Luck"));
// 利用session中间件存取信息
app.use(session({
    secret:'luck',
    resave:false,
    saveUninitialized:true
}));
// 静态化我们的public文件下的文件，使其可以直接引用
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 开发环境下错误处理
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// 生产环境下的错误处理
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

app.listen(3000,'127.0.0.1')
