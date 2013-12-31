/**
 * Controller article
 *
 *
 */
var config = require('../config').config;
var url = require('url');
var check = require('validator').check,
    sanitize = require('validator').sanitize;
var http = require('http');

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
		/*
		http.get({hostname:'www.xiami.com', port:80, path:'/app/nineteen/search/key/owl/page/1/size/1&h=xiami', agent:false}, function(response) {
		    var body = '';
		    response.on('data', function(chunk) {
		        body += chunk;
		    });

		    response.on('end', function() {
		        var fbResponse = JSON.parse(body)
		        console.log("Got response: ", fbResponse.picture);
		    });
		}).on('error', function(e) {
		      console.log("Got error: ", e);
		});*/
        
		var opts = {
		    host: 'localhost',
		    path: '/xiami.php?key=' + musicName + '&page=' + page,
		    method: 'GET',
		    headers: { 'Content-Type': 'application/json' }
		}

		var request = http.request(opts, function (response) {
		    response.setEncoding('utf8');
		    var data = ""
		    response.on('data', function(d) {
		        data += d;
		    })

		    response.on('end', function() {
		        console.log(data);
		        res.send(data);
		    })
		})

		request.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});
		request.end();
    }
}

//发布文章
exports.publish = function(req, res, next) {
	
}