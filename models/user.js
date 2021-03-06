var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config').config;

var UserSchema = new Schema({
	name: {type:String, index:true, unique: true},
	loginname: {type:String},
	pass: {type: String},
	email: {type: String, unique: true},
  url: {type: String},
  profile_image_url: {type: String},
  location: {type: String},	
  signature: {type: String},
  avatar: {type: String},
  
  score: {type: Number, default: 0},
  topic_count: {type: Number, default: 0},
  reply_count: {type: Number, default: 0},
  follower_count: {type: Number, default: 0},
  following_count: {type: Number, default: 0},
  collect_tag_count: {type: Number, default: 0},
  collect_topic_count: {type: Number, default: 0},
  create_at: {type: Date, default: Date.now},
  update_at: {type: Date, default: Date.now},
  is_star: {type: Boolean},
  level: {type: String},
  active: {type: Boolean, default: true},
  is_online: {type: Boolean, default: false},
  del_status: {type: Boolean, default: false}
});

mongoose.model('User', UserSchema);