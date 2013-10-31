/**
 * article 文章类模块
 *
 *
 */
var EventProxy = require('eventproxy');

var models = require('../models');
var Articles = models.Articles;

/**
 *  根据主题ID获取主题
 *
 *
 */
exports.getArticlesById = function(id , callback){
    var proxy = new EventProxy();

};