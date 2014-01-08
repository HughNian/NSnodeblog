/**
 * article 文章类模块
 *
 *
 */
var EventProxy = require('eventproxy'),
    markdown = require('markdown').markdown,
    Entities = require('html-entities').AllHtmlEntities;

var models = require('../models'),
    Articles = models.Articles;
var Util = require('../libs/util');
var Friends = require('./friends');
var User = require('./user');

/**
 *  根据内容id获取一篇内容
 *
 *
 */
exports.getArticleById = function(id, callback) {
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
    articles.create_at = Util.get_time();
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
    //Articles.find({del_status:{'$ne':1}}, callback);
    Articles.find({del_status:{'$ne':1}}).sort({'create_at':'desc'}).exec(function (err, articles) {
        if(err) {
            return callback(err);
        }
        var ep = EventProxy();
        ep.after("is_friend", articles.length, function (list) {
            return callback(null, list);
        });
        for(var j = 0; j < articles.length; j++){
            (function(i){
                var author_id = articles[i].author_id;
                Friends.hasFriend(userId, author_id, function (err, ret) {
                    if(err){
                        return callback(err);
                    }
                    articles[i].is_friend = ret || 0;
                    //articles[i].content = markdown.toHTML(articles[i].content);
                    //articles[i].content = decodeHTML(articles[i].content);
                    
                    var markdownContent = markdown.toHTML(articles[i].content);//生成markdown格式
                    var entities = new Entities();
                    articles[i].content = entities.encode(markdownContent);
                    
                    //articles[i].create_at = Util.format_date(articles[i].create_at, true);
                    User.getUserById(author_id, function(err, userinfo){
                        if(err){
                            return callback(err);
                        }
                        articles[i].avatar = userinfo.avatar;
                        ep.emit("is_friend", articles[i]);//尼玛这个地方肯爹呢，不能全传articles 只能一个一个的传所以传入articles[i]
                    });
                });
            })(j);
        }
    });
};

//private
function decodeHTML(text){
    text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    return text;
}