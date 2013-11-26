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
        io.on('connection', function(socket){
           User.setUserOnlineStatus(true, userinfo.name);//设置用户为上线状态
           socket.on('message', function(msg){
                 console.log('this is client push message:'+msg);
                 socket.emit('message', msg);
                 socket.broadcast.emit('broadcast', msg);
           });

           socket.on('disconnect', function(){
                 User.setUserOnlineStatus(false, userinfo.name);
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