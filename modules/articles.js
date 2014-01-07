/**
 * article 文章类模块
 *
 *
 */
var EventProxy = require('eventproxy');

var models = require('../models'),
    Articles = models.Articles,
    Friends = models.Friends;

/**
 *  根据内容id获取一篇内容
 *
 *
 */
exports.getArticleById = function(id , callback) {
    Articles.findOne({_id:id}, callback);
};

/**
 * 根据一些内容ids获取多篇内容
 *
 */
exports.getArticlesByIds = function(ids, callback){
    Articles.find({_id:{'$in': ids}}, callback);
};

/**
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

/**
 * 查找当前用户以及当前用户所有好友的最新文章信息(暂时不用)
 *
 *
 */
 exports.getUserIndexArticles = function (userId, callback) {
    callback = callback || function () {};
    var proxy = EventProxy.create('get_friends', function(friendsId){
        author_ids = friendsId.push(userId);
        Articles.find({author_id:{'$in': author_ids}}, callback);
    }).fail(callback);

    Friends.getFriendsId(userId, proxy.done(function (friendsId) {
        proxy.emit("get_friends", friendsId);
    }));
};

/**
 * 获取所有内容信息
 * 
 */
exports.getArticles = function (userId, callback) {
    Articles.find({del_status:{'$ne':1}}, callback);
    /*
    Articles.find({del_status:{'$ne': 1}}, function(articles){
        for(var i in articles){
            Friends.hasFriend(userId, articles[i].author_id, function(ret){
                if(ret) articles[i].is_friend = 1;
                articles[i].is_friend = 0;
                callback(articles);
            });
        }
    });*/
};