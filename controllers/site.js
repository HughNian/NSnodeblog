/**
 *  Controller Site
 *
 *
 */
var config = require('../config').config;

exports.index = function (req, res) {

    res.render('index',{
        title: config.name,
        description: config.description
    }, function(err, html){
        if(err){
            console.log(err);
        }
    });
}