/**
 *
 * NSnodeblog
 * @author: hughnian <hugh.nian@163.com>
 *
 * ||    || ||\\   ||
 * ||----|| || \\  ||
 * ||----|| ||  \\ ||
 * ||    || ||   \\||
 *
 */
var http = require('http');
var express = require('express');
var partials = require('express-partials');
var engines = require('consolidate');
var routes = require('./routes');
var fs = require('fs');
var path = require('path');
var config = require('./config').config;
var routes = require('./routes');
//var MongoSorge = require('connect-mongo')(express);

var app = express();
app.use(partials());
app.set('port', config.port || 3000);
//模版加载配置
app.set('view engine', 'html');
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');

/*
app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');
*/
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser({ keepExtensions: true, uploadDir: config.upload_dir }));//上传文件目录
app.use(express.cookieParser());
app.use(express.session({
    secret: config.session_secret,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}//30 days
}));
app.use(app.router);

var server = http.createServer(app).listen(config.port, function(){
    console.log('Express server listening on port ' + config.port);
});

io = require('socket.io').listen(server);//初始化socket.io
io.set('log level', 0);

//redis
var redis = require("redis");
rclient = redis.createClient('6379', '127.0.0.1');//全局redis client对象
rclient.setMaxListeners(0);
// routes
routes(app);

clients = [];//全局数组变量，存储socket.io对象

//输出各对象变量以便全局使用
module.exports = app;
module.exports = io;
module.exports = clients;
module.exports = rclient;