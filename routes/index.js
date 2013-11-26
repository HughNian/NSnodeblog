/*
 * routes/index.js
 *
 * site 路由文件
 *
 */
var site = require('../controllers/site');
var sign = require('../controllers/sign');

module.exports = function(app) {
    //首页
    app.get('/', site.index);
    //用户注册，登录，退出
    app.get('/register', sign.showRegister);
    app.post('/register', sign.register);
    app.get('/login', sign.showLogin);
    app.post('/login', sign.login);
    app.get('/logout', sign.logout);

};
