var check = require('validator').check,
  sanitize = require('validator').sanitize;

var crypto = require('crypto');
var config = require('../config').config;

var User = require('../modules').User;

//register
exports.showRegister = function(req, res) {
    if(req.session.user){
        res.redirect('/home');
    }
    res.render('sign/register');
};

/**
 * 注册
 *
 *
 */
exports.register = function(req, res, next){
    var name = sanitize(req.body.name).trim();
    var loginname = name.toLowerCase();
    var pass = sanitize(req.body.pass).trim();
    var email = sanitize(req.body.email).trim();
    email = email.toLowerCase();
    var re_pass = sanitize(req.body.re_pass).trim();
    var signature = sanitize(req.body.signature).trim();
    
    /*
    if(name ==='' || pass === '' || re_pass === '' || email === ''){
        res.render('sign/register', {error:'信息不完整', name: name, email: email});
        return;	
    }*/
    if(name ==='' || pass === '' || email === ''){
        res.render('sign/login', {error:'信息不完整', name: name, email: email});
        return;
    }
    
    if(name.length < 5) {
        res.render('sign/login', {error: '用户名至少需要5个字符', name: name, email:email});	
        return;
    }
    
    try{
        check(name, '用户名只能使用0-9, a-z, A-Z').isAlphanumeric();	
    } catch(e) {
    	res.render('sign/login', {error: e.message, name: name, email:email});
    	return;
    }
    /*
    if(pass !== re_pass){
    	res.render('sign/register', {error: '两次密码不一样', name:name, email:email});
    	return;
    }*/
    try{
    	check(email, '不正确的电子邮箱').isEmail();
    } catch(e) {
    	res.render('sign/login', {error:e.message, name:name, email:email});
    	return;
    }
    
    
    User.getUsersByQuery({'$or': [{'name': name}, {'email': email}]}, function(err, users){
    	if(err){
    		return next(err);
    	}
    	
    	if(users.length > 0){
    		res.render('sign/login', {error: '用户名或邮箱已被使用', name:name, email:email});
    		return;
    	}
    	
    	pass = md5(pass);
      var avatar_url = 'http://www.gravatar.com/avatar/'+md5(email.toLowerCase())+'?size=120';
      
    	User.newAndSave(name, pass, email, avatar_url, signature, false, function(err){
	    	if(err){
	    		return next(err);
	    	}
	      User.getUserByName(name, function(err, user){	      	
	      	gen_session(user, req, res);
	      	res.redirect('/home');
	      });
	    });
    });
};

//login
exports.showLogin = function(req, res){
    if(req.session.user){
        res.redirect('/home');
    }
	req.session._loginReferer = req.headers.referer;
	res.render('sign/login');
};

/**
 * 登录
 *
 *
 */
exports.login = function(req, res, next){
	var name = sanitize(req.body.name).trim().toLowerCase();
	var pass = sanitize(req.body.pass).trim();
    
	if(!name || !pass){
		return res.render('sign/login', {error: '信息不完整'});
	}

	User.getUserByName(name, function(err, user){
		if(err){
		    return next(err);
		}
		if(!user){
		    return res.render('sign/login', {error: '用户不存在'});	
		}
		pass = md5(pass);
		if(pass !== user.pass){
		    return res.render('sign/login', {error: '密码错误'});
		}
        
		gen_session(user, req, res);
		res.redirect('/home');
	});
};

/**
 * 退出
 *
 *
 */
exports.logout = function(req, res, next){
    /*
    var userinfo = req.session.user;
    User.setUserOnlineStatus(false, userinfo.name, function(err, ret){ //设置用户下线状态
        if(err){
           return next(err);
        }
        if(ret){
            req.session.destroy();
            res.clearCookie(config.auth_cookie_name, {path: '/'});
            res.redirect(req.headers.referer || '/');
        }
    }); */
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, {path: '/'});
    res.redirect('/' || req.headers.referer);
};

function md5(str)
{
	var md5sum = crypto.createHash('md5');
	md5sum.update(str);
	str = md5sum.digest('hex');
	return str;
}

function randomString(size)
{
	size = size || 6;
	var code_string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var max_num = code_string.length+1;
	var new_pass = '';
	while(size > 0){
	    new_pass += code_string.charAt(Math.floor(Math.random()*max_num));
	    size--;
	}
	return new_pass;
}

/**
 * @todo 加密函数
 *
 */
function encrypt(str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
}

/**
 * private 存储session 通过cookie方式
 *
 */
function gen_session(user, req, res){
	req.session.user = user;
	var auth_token = encrypt(user._id+'\t'+user.name+'\t'+user.pass+'\t'+user.email, config.session_secret);
	res.cookie(config.auth_cookie_name, auth_token, {path: '/', maxArg: 1000 * 60 * 60 * 4 * 30});//cookie有效期30天
}