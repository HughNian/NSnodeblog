/**
 * article 文章类模块
 *
 *
 */
var EventProxy = require('eventproxy'),
    markdown = require('markdown').markdown,
    marked = require('marked'),
    Entities = require('html-entities').AllHtmlEntities;

var models = require('../models'),
    Articles = models.Articles;
var Util = require('../libs/util');
var Friends = require('./friends');
var User = require('./user');

var config = require('../config').config;

// Set default options
marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  codeClass: 'prettyprint',
  langPrefix: 'language-'
});

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
exports.getArticles = function (userId, page, callback) {
    //Articles.find({del_status:{'$ne':1}}, callback);
    /*eventproxy方式取数据
    var ep = EventProxy();
    ep.assign('get_count', 'get_data', function (count, articles){
        ep.after("is_friend", articles.length, function (list) {
            list.total = count;
            list.page = Number(page);
            list.pages = Math.ceil(count/10);
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
                    articles[i].content = Util.xss(marked(articles[i].content));//生成markdown格式,同时要用xss转义输出安全输出内容
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
    }).fail(callback);
    Articles.count({del_status:{'$ne':1}}, ep.done(function (count){
        ep.emit("get_count", count);
    }));*/
    /*
    Articles.find({del_status:{'$ne':1}}, null, {skip: (page - 1)*config.articles_count, limit: config.articles_count, sort: {'create_at': 1}}, ep.done(function (articles){
        ep.emit("get_data", articles);
    }));*/
    /*
    Articles.find({del_status:{'$ne':1}}).skip((page-1)*config.articles_count).limit(config.articles_count).sort({'create_at':'desc'}).exec(ep.done(function (articles){
        ep.emit("get_data", articles);
    }));*/

    //普通方式取数据
    Articles.count({del_status:{'$ne':1}}, function (err, count){
        if(err){
            callback(err);
        }
        Articles.find({del_status:{'$ne':1}}).skip((page-1)*config.articles_count).limit(config.articles_count).sort({'create_date':'desc'}).exec(function (err, articles) {
            if(err) {
                return callback(err);
            }
            var ep = EventProxy();
            ep.after("is_friend", articles.length, function (list) {
                list.total = count;
                list.page = Number(page);
                list.pages = Math.ceil(count/config.articles_count);
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
                        articles[i].content = Util.xss(marked(articles[i].content));//生成markdown格式,同时要用xss转义输出安全输出内容
                        /*
                        var markdownContent = marked.toHTML(articles[i].content);
                        var entities = new Entities();
                        articles[i].content = entities.encode(markdownContent);
                        */
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
    });
};

/**
 * 根据内容ID，查找一条内容主题
 * 
 * 
 */
exports.getOneArticles = function (id, callback) {
  Articles.findOne({_id: id}, callback);
};

//private
function decodeHTML(text){
    text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    return text;
}