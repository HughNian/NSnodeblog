/*
 *  site config
 *
 */
var path = require('path');

exports.config = {
  name: 'Love Life',
  debug: true,
  description: 'Love Life --Power by NSnodeblog',
  host: '127.0.0.1',
  version: '0.1.1',

  //上穿文件目录
  upload_dir: path.join(__dirname+'/upload', 'public', 'user_data', 'images'),

  db: 'mongodb://127.0.0.1/node_club_dev',
  session_secret: 'node_club',
  auth_cookie_name: 'node_club',
  port: 3000,

  //列表显示文章个数
  articles_count: 20,

  //友情连接
  site_links: [
    {
        'text': 'Node 官方网站',
        'url': 'http://nodejs.org/'
    },
    {
        'text': 'Node Party',
        'url': 'http://party.cnodejs.net/'
    },
    {
        'text': 'Node 入门',
        'url': 'http://nodebeginner.org/index-zh-cn.html'
    },
    {
        'text': 'Node 中文文档',
        'url': 'http://docs.cnodejs.net/cman/'
    }
  ]
}