/**
 * friends 好友模型
 *
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var FriendsSchema = new Schema({
	user_id: {type: ObjectId},
	friend_uid: {type: ObjectId},
	friend_name: {type: String},
	status: {type:Number, default:0},//1为是好友关系，0为不是好友关系
	create_time: {type:Date, default:Date.now}
});

mongoose.model('Friends', FriendsSchema);