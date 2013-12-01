/**
 * chats modules
 *
 */
 //redis
var redis = require("redis");
var rclient = redis.createClient('6379', '127.0.0.1');

//setchats
exports.setChats = function(data, callback){
    rclient.on('error', function(error){
		console.log(error);
		return callback(error);
	});
	rclient.select('15', function(error){
		if(error){
          console.log(error);
          return callback(error);
		}
        rclient.hmset('user_msg', data, callback);
	});
};

//getchats
exports.getChats = function(from_user, callback){
	rclient.on('error', function(error){
		console.log(error);
		return callback(error);
	});
	rclient.select('15', function(error){
		if(error){
          console.log(error);
          return callback(error);
		}
        rclient.hmget('user_msg', from_user, callback);
	});
};