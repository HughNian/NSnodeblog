/**
 *
 * NSnodeblog
 * @author: hughnian <hugh.nian@163.com>
 *
 * ||    || ||\\   ||
 * ||----|| || \\  ||
 * ||----|| ||  \\ ||
 * ||    || ||   \\||
 *
 */
var http = require('http');
var express = require('express');
var routes = require('./routes');
var fs = require('fs');
var config = require('./config').config;
var routes = require('./routes');
var MongoSorge = require('connect-mongo')(express);

var app = express();
