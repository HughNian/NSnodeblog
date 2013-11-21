var check = require('validator').check,
  sanitize = require('validator').sanitize;

var crypto = require('crypto');
var config = require('../config').config;

var User = require('../modules').User;

//register
exports.showRegister = function(req, res) {
    res.render('sign/register');
};

exports.register = function(req, res, next){
    var name = sanitize(req.body.name).trim();
    var loginname = name.toLowerCase();
    var pass = sanitize(req.body.pass).trim();
    var email = sanitize(req.body.email).trim();
    email = email.toLowerCase();
    var re_pass = sanitize(req.body.re_pass).trim();
    var signature = sanitize(req.body.signature).trim();
    
    if(name ==='' || pass === '' || re_pass === '' || email === ''){
        res.render('sign/register', {error:'信息不完整', name: name, email: email});
        return;	
    }
    
    if(name.length < 5) {
        res.render('sign/register', {error: '用户名至少需要5个字符', name: name, email:email});	
        return;
    }
    
    try{
        check(name, '用户名只能使用0-9, a-z, A-Z').isAlphanumeric();	
    } catch(e) {
    	res.render('sign/register', {error: e.message, name: name, email:email});
    	return;
    }
    
    if(pass !== re_pass){
    	res.render('sign/register', {error: '两次密码不一样', name:name, email:email});
    	return;
    }
    
    try{
    	check(email, '不正确的电子邮箱').isEmail();
    } catch(e) {
    	res.render('sign/register', {error:e.message, name:name, email:email});
    	return;
    }
    
    pass = md5(pass);
    var avatar_url = 'http://www.gravatar.com/avatar'+md5(email.toLowerCase())+'?size=48';
    
    User.newAndSave(name, pass, email, avatar_url, signature, false, function(err){
    	if(err){
    		return next(err);
    	}
    res.redirect('/?is_login=1');
    });
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