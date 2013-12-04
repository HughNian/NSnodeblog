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
	var user_msg = req.body.user_msg,
	    from_user = sanitize(req.body.from_user).trim();
      to_user = sanitize(req.body.to_user).trim();
      Chats.getChats(from_user, function(error, data){
        if(error){
           return next(error);
        }
        data = JSON.parse(data);
        console.log("user_msg");
        console.log(user_msg);
        console.log("data");
        console.log(data);
        console.log('to_user');
        console.log(to_user);
        var save_data = {};
        if(array_key_exists(to_user, data)){
          console.log("add_msg");
          console.log(user_msg[to_user][user_msg[to_user].length-1]);
          data[to_user].push(user_msg[to_user][user_msg[to_user].length-1]);
          save_data = data;
        } else {
          save_data = user_msg
        }
        console.log('save_data');
        console.log(save_data);
        Chats.setChats(from_user, JSON.stringify(save_data), function(error){
          if(error){
             return next(error);
          }
          var ret = {"result":1};
          res.send(ret);
        });
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
      var ret = {"result":1,"data":data}
      res.send(ret);
   });
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