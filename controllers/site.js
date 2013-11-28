/**
 *  Controller Site
 *
 *
 */
var config = require('../config').config;
var url = require('url');
var User = require('../modules').User;

exports.index = function (req, res, next) {
	 //var oUrl = url.parse(req.url, true)
    //var is_login = oUrl.query.is_login ?  oUrl.query.is_login : 0;
    var cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
       var parts = cookie.split('=');
       cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    var usercookie = cookies.nsblog;
    var is_login = 1;
    var usersession = req.session.user;
    var userinfo = usersession;
    var haoyou = false;

    if(typeof(usersession) === 'undefined'){
    	userinfo = {};
    }
    if(typeof(usercookie) === "undefined" && typeof(usersession) === 'undefined'){
        is_login = 0;
        res.render('index',{
            title: config.name,
            description: config.description,
            is_login:is_login,
            userinfo: userinfo,
            haoyou: haoyou
        });
    } else {
        io.once('connection', function(socket){
           User.setUserOnlineStatus(true, userinfo.name);//设置用户为上线状态
           clients[userinfo.name] = socket;//把当前用户的socket对象存在全局数组变量clients中，以实现点对点单聊
           socket.on('message', function(data){
                 //dataformat:{to:'all',from:'Nick',msg:'msg'}
                 console.log('this is client push message:'+data.msg);
                 clients[data.to].emit('message', {to:data.to, from:data.from, msg:data.msg});
                 clients[data.from].emit('message', {to:data.to, from:data.from, msg:data.msg});
                 //socket.broadcast.emit('broadcast', msg); //广播消息
           });

           socket.on('disconnect', function(){
                 User.setUserOnlineStatus(false, userinfo.name); //socket断开连接，设置用户离线状态
          });
        });
        User.getUsersNoDel(true, false, userinfo.name, function(err, friends){
            if(err){
                return next(err);
            }
            res.render('index',{
                title: config.name,
                description: config.description,
                is_login:is_login,
                userinfo: userinfo,
                haoyou: friends
            });
        });
    }
}

/**
 * 首页ajax获取好友信息(2013-11-27)
 *
 *
 */
exports.friends = function(req, res, next)
{
    var oUrl = url.parse(req.url, true);
    var name = oUrl.query.name;
    console.log(name);
    User.getUsersNoDel(true, false, name, function(err, users){
         if(err){
             return next(err);
         }
        res.send(users);
    });
}