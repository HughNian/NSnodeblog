/**
 *  Controller Site
 *
 *
 */
var config = require('../config').config,
    url = require('url'),
    User = require('../modules').User,
    Chats = require('../modules').Chats,
    Friends = require('../modules').Friends,
    Articles = require('../modules').Articles,
    EventProxy = require('eventproxy');

exports.index = function (req, res, next) {
	  var oUrl = url.parse(req.url, true)
    var page = oUrl.query.page ?  oUrl.query.page : 1;
    if(!req.session.user) res.redirect('/');//如果没有登录返回登录界面首页
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
    	var userinfo = {};
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
                 //dataformat:{to:'User1',from:'User2',msg:'msg'}
                 //console.log('this is client push message:'+data.msg);
                 var msg = replace_em(data.msg);
                 if(typeof clients[data.to] === "undefined"){
                   Chats.getChats(data.to, function(error, user_msg){
                    if(error){
                       return next(error);
                    }
                    user_msg = JSON.parse(user_msg);
                    var save_data = {};
                    if(user_msg != null){
                      if(array_key_exists(data.from, user_msg)){
                        user_msg[data.from].push({"from_msg":msg});
                        save_data = user_msg;
                      } else {
                        save_data = user_msg;
                      }
                    } else {
                      var new_data = {};
                      new_data[data.from] = new Array({"from_msg":msg});
                      save_data = new_data;
                    }
                    Chats.setChats(data.to, JSON.stringify(save_data), function(error){
                      if(error){
                         return next(error);
                      }
                    });//保存离线消息
                   });
                 } else {
                   clients[data.to].emit('message', {to:data.to, from:data.from, msg:msg});//当目标用户在线，发给目标用户 
                 }
                 clients[data.from].emit('message', {to:data.to, from:data.from, msg:msg});//发给自己
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
          ep = new EventProxy.create('get_article', 'friends_num', function (articles, num) {
            res.render('index',{
              title: config.name,
              description: config.description,
              is_login: is_login,
              userinfo: userinfo,
              articles: articles,
              haoyou: friends,
              friends_num: num
            });
          }).fail(next);
          Articles.getArticles(userinfo._id, page, ep.done(function (articles) {
            ep.emit('get_article', articles);
          }));
          Friends.getFriendsNum(userinfo._id, ep.done(function (num) {
            ep.emit('friends_num', num);
          }));
        });
    }
}

/**
 * 首页ajax获取好友信息(2013-11-27)
 *
 *
 */
exports.friends = function(req, res, next) {
    var oUrl = url.parse(req.url, true);
    var name = oUrl.query.name;
    User.getUsersNoDel(true, false, name, function(err, users){
         if(err){
             return next(err);
         }
        res.send(users);
    });
}

/**
 * 加关注
 *
 */
exports.addfriend = function(req, res, next) {
  var userinfo = req.session.user;
  var oUrl = url.parse(req.url, true),
      addUserId = oUrl.query.add_user,
      userId = userinfo._id;
  Friends.hasFriend(userId, addUserId, function (err, ret) {
    if(err){
       return next(err);
    }
    var result = {};
    if(ret) {
      result = "{ret:false, msg:'已经关注了该用户'}";
      res.send(result);
      return;
    }
    var proxy = EventProxy.create('get_friend_name', 'add_friend', function () {
      result = "{ret:true, msg:'关注成功'}";
      res.send(result);
    }).fail(next);
    User.getUserById(addUserId, proxy.done(function (friend) {
      var friendNmae = friend.name;
      proxy.emit('get_friend_name');
        Friends.addFriend(userId, addUserId, friendNmae, proxy.done("add_friend"));
    }));
  });
}

/**
 * 取消关注
 *
 */
exports.delfriend = function (req, res, next){
  var userinfo = req.session.user;
  var oUrl = url.parse(req.url, true),
      addUserId = oUrl.query.del_user,
      userId = userinfo._id;
  var result = {};
  var proxy = EventProxy.create('del_friend', function () {
    result = "{ret:true, msg:'取消成功'}";
    res.send(result);
  }).fail(next);
  Friends.removeFriend(userId, addUserId, proxy.done('del_friend'));
}

/**
 * 404页面
 */
exports.notfind = function (req, res) {
    res.render("404", {title: "Nsnodeblog 帮助寻人"});
}

//private
function array_key_exists(key, arr) {
  for(var k in arr) {
    if( k == key) {
      return true;
    }
  }
  return false;
}

function replace_em(str){
  //str = str.replace(/\</g,'&lt;');
  //str = str.replace(/\>/g,'&gt;');
  //str = str.replace(/\n/g,'<br/>');
  str = str.replace(/\[em_([0-9]*)\]/g,'<img src="/images/face/$1.gif" border="0" />');
  return str;
}