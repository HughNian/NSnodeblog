/**
 * Controller article
 *
 *
 */
var config = require('../config').config;
var url = require('url');
var check = require('validator').check,
    sanitize = require('validator').sanitize;
var request = require('request');

//显示发布文章页面
exports.index = function(req, res, next) {
    var pathname = url.parse(req.url).pathname;
    var parms = pathname.split('/'),
        type = parms.pop();
    
	res.render('article/showpublish',{
	    type:type,
	    title:config.name,
	    description: config.description
	});
}

exports.music = function(req, res, next) {
	var oUrl = url.parse(req.url, true);
    var musicName = oUrl.query.musicName;
    var page = oUrl.query.page;
    if(musicName != ""){
        var xiamiurl = config.xiami_api+musicName+'/page/'+page+'/size/1';
    	request(xiamiurl, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    console.log(body) // Print the google web page.
		  }
		});
    }
}

//发布文章
exports.publish = function(req, res, next) {
	
}