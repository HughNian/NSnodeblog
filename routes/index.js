/*
 * routes/index.js
 *
 * site 路由文件
 *
 */
var site = require('../controllers/site');
var sign = require('../controllers/sign');
var chats = require('../controllers/chats');

module.exports = function(app) {
    //首页
    app.get('/', site.index);
    //ajax获取好友
    app.get('/friends', site.friends);
    //ajax保存聊天记录
    app.post('/setchats', chats.setchats);
    //ajax获取聊天纪录
    app.get('/getchats', chats.getchats);
    
    //用户册，登录，退出
    app.get('/register', sign.showRegister);
    app.post('/register', sign.register);
    app.get('/login', sign.showLogin);
    app.post('/login', sign.login);
    app.get('/logout', sign.logout);

};
