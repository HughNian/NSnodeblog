var mongoose = require('mongoose');
var config = require('../config').config;

mongoose.connect(config.db, function(err){
   if(err){
      console.error('connect to %s error:', config.db, err.message);
      process.exit(1);
   }
});

// models
require('./articles');
require('./user');

exports.Articles = mongoose.model('Articles');
exports.User = mongoose.model('User');