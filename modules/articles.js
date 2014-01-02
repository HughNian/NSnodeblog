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


/*
 * 添加文章
 *
 */
exports.newAndSave = function (data, callback) {
    var articles = new Articles();
    articles.title = data.title;
    articles.content = data.content;
    articles.author_id = data.author_id;
    articles.author_name = data.author_name;
    articles.pic_url = data.pic_url;
    articles.video_url = data.video_url;
    articles.music_id = data.music_id;
    articles.music_logo = data.music_logo;
    articles.save(callback);
};