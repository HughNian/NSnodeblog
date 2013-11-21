/**
 *  Controller Site
 *
 *
 */
var config = require('../config').config;
var url = require('url');

exports.index = function (req, res) {
	  var oUrl = url.parse(req.url, true); // ½âÎöµ±Ç°URL
    var is_login = oUrl.query.is_login ?  oUrl.query.is_login : 0;
    res.render('index',{
        title: config.name,
        description: config.description,
        is_login:is_login
    });
}