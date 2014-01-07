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
	var friends = new Friends;
	friends.user_id = userId;
	friends.friend_uid = friendsId;
	friends.friend_name = friendsName;
	friends.status = 1;//成为好友关系状态
	friends.save(callback);
};

/**
 * 判断某个用户是否是当前用户的好友
 */
exports.hasFriend = function(userId, friendsId, callback){
	Friends.count({user_id:userId, friend_uid:friendsId, status:1}, callback);
}

/**
 * 删除好友
 *
 */
exports.removeFriend = function(userId, friendsId, callback){
	Friends.update({friend_uid:friendsId}, {status:0}, callback);
}