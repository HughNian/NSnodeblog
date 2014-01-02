/**
 * Controller article
 *
 *
 */
var config = require('../config').config,
    url = require('url'),
    check = require('validator').check,
    sanitize = require('validator').sanitize,
    http = require('http'),
    Articles = require('../modules').Articles;

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
    var musicName = encodeURIComponent(oUrl.query.musicName);
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
		        res.send(data);
		    })
		})

		request.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});
		request.end();
    } else {
    	var ret = '{"total":null,"results":[],"key":""}';
    	res.send(ret);
    }
}

//发布文章
exports.publish = function(req, res, next) {
	var title = sanitize(req.body.title).trim(),
	    content = sanitize(req.body.content).trim(),
	    pic_url = sanitize(req.body.pic_url).trim(),
	    video_url = sanitize(req.body.video_url).trim(),
	    music_id = sanitize(req.body.musicid).trim(),
	    music_logo = sanitize(req.body.musicimg).trim(),
	    type = req.body.type;
    /*
	var backUrl = req.header('Referer'),//获取referer URL
	    urls = backUrl.split('/'),
	    type = urls.pop();
	    backUrl = 'publish/index/'+type;
	*/
	if(!title || !content){
		//res.redirect(backUrl);
		res.render('article/showpublish', {
			error:"请填写完整内容", 
			type:type, 
			title:config.name,
	    	description: config.description}
	    );
		return;
	}
	var userinfo = req.session.user;
	var data = {};
		data.title = title;
		data.content = content;
		data.pic_url = pic_url;
		data.video_url = video_url;
		data.music_id = music_id;
		data.music_logo = music_logo;
		data.author_id = userinfo._id;
		data.author_name = userinfo.name;
	Articles.newAndSave(data, function(err){
		if(err){
	        return next(err);
	    }
	    res.redirect('/');
	});
}