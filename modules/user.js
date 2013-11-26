var models = require('../models');
var User = models.User;

/**
 * @todo 通过一组用户名获取用户
 *
 *
 */
exports.getUserByNames = function(names, callback){
   if(names.length === 0) {
       return callback(null, []);	
   }
   User.find({name: {$in: names}}, callback);
};

/**
 * 通过一个用户名获取一条用户信息
 *
 */
exports.getUserByName = function(name, callback){
	User.findOne({name: name}, callback);
};

/**
 * 根据登录名查找用户
 *
 *
 */
exports.getUserByLoginName = function(loginName, callback){
	User.findOne({'loginname': loginName}, callback);
};

/**
 * 根据用户id, 查找用户
 *
 *
 */
exports.getUserById = function(id, callback){
	User.findOne({_id:id}, callback);
};

/**
 * 根据一些关键字，获取一组用户
 *
 *
 */
exports.getUsersByQuery = function (query, callback) {
  User.find(query, callback);
};

/**
 * @todo find no del users by status and not this name user(2013-11-26)
 *
 *
 */
exports.getUsersNoDel = function(is_online, del_status, name, callback)
{
   User.find({is_online: is_online, del_status: del_status, name: {$ne: name}}, callback);
};

/**
 *  set user online status by name (2013-11-26)
 *
 */
exports.setUserOnlineStatus = function(status, name, callback){
   User.findOne({name: name}, function(err, user){
       if(err){
          return callback(err);
       }
       user.is_online = status;
       user.save(callback);
   });
};

/**
 * 保存用户
 *
 *
 */
exports.newAndSave = function(name, pass, email, avatar_url, signature, active, callback){
	var user = new User();
	user.name = name;
	user.pass = pass;
	user.email = email;
	user.avatar = avatar_url;
	user.active = false;
	user.signature = signature
	user.save(callback);
};