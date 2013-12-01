/**
 * ajax获取redis聊天信息
 *
 */
var check = require('validator').check,
    sanitize = require('validator').sanitize;
var Chats = require('../modules').Chats;

exports.setchats = function(req, res, next)
{   
	var user_msg = sanitize(req.body.user_msg).trim();
	console.log(user_msg);
	res.send('shit');
	/*
    Chats.setChats(user_msg, function(){
      
    });*/
};

exports.getchats = function(req, res, next)
{
   
}