/**
 *  Controller Site
 *
 *
 */
var config = require('../config').config;
var url = require('url');

exports.index = function (req, res) {
	 //var oUrl = url.parse(req.url, true)
    //var is_login = oUrl.query.is_login ?  oUrl.query.is_login : 0;
    var cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
       var parts = cookie.split('=');
       cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();                       
    });
    var usercookie = cookies.nsblog;
    var is_login = 1;
    if(typeof(usercookie) === "undefined"){
   	   is_login = 0;
    }
    var usersession = req.session.user;
    var userinfo = usersession;
    if(typeof(usersession) === 'undefined'){
    	 userinfo = {};
    }
    res.render('index',{
	        title: config.name,
	        description: config.description,
	        is_login:is_login,
	        userinfo: userinfo
    });
}