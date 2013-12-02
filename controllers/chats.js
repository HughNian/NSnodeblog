/**
 * ajax获取redis聊天信息
 *
 */
var check = require('validator').check,
    sanitize = require('validator').sanitize;
var Chats = require('../modules').Chats;
var url = require('url');

exports.setchats = function(req, res, next)
{ 
	var user_msg = sanitize(req.body.user_msg).trim(),
	    from_user = sanitize(req.body.from_user).trim(),
	    data = {};
	data[from_user] = user_msg;
    Chats.setChats(data, function(error){
      if(error){
         return next(error);
      }
      var ret = {"result":1};
      res.send(ret);
      rclient.end();
    });
};

exports.getchats = function(req, res, next)
{
   var oUrl = url.parse(req.url, true);
   var from_user = oUrl.query.from_user;
   Chats.getChats(from_user, function(error, data){
      if(error){
         return next(error);
      }
      data = JSON.parse(data);
      console.log(data);
      var ret = {"result":1,"data":data}
      res.send(ret);
      rclient.end();
   });
}