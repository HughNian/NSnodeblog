/**
 * chats modules
 *
 */
//setchats
exports.setChats = function(from_user, data, callback){
    rclient.on('error', function(error){
		console.log(error);
		return callback(error);
	});
	rclient.select('15', function(error){
		if(error){
          console.log(error);
          return callback(error);
		}
        rclient.set(from_user, data, callback);
	});
};

//getchats
exports.getChats = function(from_user, callback){
	rclient.on('error', function(error){
		console.log(error);
		return callback(error);
	});
	rclient.select('15', function(error){
		if(error){
          console.log(error);
          return callback(error);
		}
        rclient.get(from_user, callback);
	});
};