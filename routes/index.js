/*
 * routes.js
 *
 * site 路由文件
 *
 */
var site = require('../controllers/site');

module.exports = function(app) {
    // home page
    app.get('/', site.index);

}
