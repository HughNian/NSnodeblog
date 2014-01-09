/**
 * friends 好友类模块
 *
 *
 */
var EventProxy = require('eventproxy');

var models = require('../models'),
    Friends = models.Friends;

exports.getFriendsId = function(userId, callback){
   Friends.find({user_id: userId}, callback);
};

exports.addFriend = function(userId, friendsId, friendsName, callback){
	var ep = EventProxy.create('friend_exists', function (ret){
		if(ret) {
			Friends.update({user_id:userId, friend_uid:friendsId}, {status:1}, callback);//再次关注
		} else {
			var friends = new Friends;
			friends.user_id = userId;
			friends.friend_uid = friendsId;
			friends.friend_name = friendsName;
			friends.status = 1;//成为好友关系状态
			friends.save(callback);
		}
	}).fail(callback);
	this.friendexists(userId, friendsId, ep.done(function (ret){
		ep.emit('friend_exists', ret);
	}));
};

/**
 * 判断某个用户是否是当前用户的好友
 */
exports.hasFriend = function(userId, friendsId, callback){
	Friends.count({user_id:userId, friend_uid:friendsId, status:1}, callback);
}

/**
 * 检测某个要关注的好友是否已经存在该用户的好友表中
 *
 */
exports.friendexists = function(userId, friendsId, callback){
	Friends.count({user_id:userId, friend_uid:friendsId}, callback);
}

/**
 * 取消关注
 *
 */
exports.removeFriend = function(userId, friendsId, callback){
	Friends.update({user_id:userId, friend_uid:friendsId}, {status:0}, callback);
}