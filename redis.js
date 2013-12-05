var redis = require('redis');
var client = redis.createClient('6379', '127.0.0.1');

client.on('error', function(error){
    console.log(error);
});

/*
client.select('15', function(error){
    if(error){
    	console.log(error);
    } else {
    	var info = {};
    	info.niansong = [{"songsong":[{"to_msg":"nihao"},{"from_msg":"hello"}]},{"lilei":[{"to_msg":"hi"},{"from_msg":"hello"}]}];
    	info.xiaowang = [{"xiaoxia":[{"to_msg":"cao"},{"from_msg":"fuck"}]},{"xiaogang":[{"to_msg":"shit"},{"from_msg":"ca"}]}];
    	client.hmset("user_msg", info, function(error, res){
            if(error){
            	console.log(error);
            } else {
            	console.log(res);
            }
            client.end();
    	});
    }
});*/

/*
client.select('15', function(error){
    if(error){
       console.log(error);
    } else {
    	client.hmget("user_msg", 'niansong', function(err, res){
    		if(error){
               console.log(error);
    		} else {
    			console.log(res);
    		}
    		client.end();
    	});
    }
});*/

/*
client.select('15', function(error){
    if(error){
       console.log(error);
    } else {
        client.hdel("user_msg", 'niansong', function(err, res){
            if(error){
               console.log(error);
            } else {
                console.log(res);
            }
            client.end();
        });
    }
});*/

client.select('15', function(error){
    if(error){
       console.log(error);
    } else {
        client.get('hahaya', function(err, res){
            if(error){
               console.log(error);
            } else {
                console.log(JSON.parse(res));
            }
            client.end();
        });
    }
});