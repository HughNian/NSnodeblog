//javascript document

//建立websocket连接
socket = io.connect('http://127.0.0.1:3000');

user_msg = {};//全局用户聊天信息对象
chat_users = [];

$(".sendbutton").click(function(){
  sendmsg();
});

$(".area").keydown(function(event){//兼容火狐浏览器需要传入event对象
   evt = event || window.event;//兼容ie6
   if(evt.keyCode==13){//按回车提交内容 如果加上 && event.ctrlKey 则crtl+enter提交
     sendmsg();
     evt.returnValue = false;//不换行
     return false;//不换行
   }
});

socket.on('message', function(data){
   if(typeof user_msg[data.from] == "undefined")
      user_msg[data.from] = new Array({"from_msg":data.msg});
   else
      user_msg[data.from].push({"from_msg":data.msg});
      var now_user = $("#avatar").attr("alt");
      delete user_msg[now_user];
   
   /*** 保存聊天记录 start ***/
   var to_user = data.from;
   if(now_user == to_user) var to_user = $(".chatname").html();
   savechats(now_user, to_user, user_msg);
   /*** 保存聊天记录 end ***/

   user_count = 0;
   msg_count = 0;
   var from_msg = [];
   if(typeof msg_count_old == "undefined")msg_count_old = 0;
   for(var key in user_msg){
       user_count++;
       for(var k in user_msg[key]){
          if(typeof user_msg[key][k].from_msg != "undefined")
           from_msg.push(user_msg[key][k].from_msg);
       }
   }
   msg_count = from_msg.length;
   if (data.to == $("#avatar").attr("alt") && $(".sendbox").css('display') == "none") {
      $(".chatbox").html("您有"+(msg_count-msg_count_old)+"消息");
      $(".chatbox").css("height",0).show().animate({"height":"25px"});
   } else if (data.to == $("#avatar").attr("alt") && $(".sendbox").css('display') == "block" && user_count > 1){
      showUserList();
   }

   if(data.from == $("#avatar").attr("alt")){
       var p = '<div class="chatdiv" id="chatdiv"><p class="p1">'+data.msg+'</p></div>';
   } else if(data.from == $(".chatname").html()){
       if($(".sendbox").css('display') == "block") msg_count_old += 1;
       var p = '<div class="chatdiv" id="chatdiv"><p class="p2">'+data.msg+'</p><div>';
   }
   $(".sendlist").append(p);
   $('#sendlist').scrollTop($('#sendlist')[0].scrollHeight+$('#chatdiv').height()+50);//到scroll底部
});

//监听广播消息(群聊)
socket.on('broadcast', function(msg){
   var p = '<div class="chatdiv" id="chatdiv"><p class="p2">'+msg+'</p><div>';
   $(".sendlist").append(p);
   $('#sendlist').scrollTop($('#sendlist')[0].scrollHeight+$('#chatdiv').height()+50);//到scroll底部
});

//点击用户头像打开聊天窗口
$(".avatar").live('click', function(){
  var name = $(this).attr('title');
  var name_exists = $(".chatname").html();
  var userlist = [];
  if(name_exists != "" && !in_names(name_exists, chat_users)){
    chat_users.push(name_exists);
  }
  if(!in_names(name, chat_users)){
    chat_users.push(name);
  }
  showUserMsg(name);
  $(".sendbox").css({'height':'0'}).show().animate({'height':'440px'});
  if(chat_users.length > 1){
    for(var key in chat_users){
       userlist.push("<span class='username' data-name="+chat_users[key]+">"+chat_users[key]+"<label class='deluser'>X</label></span>");
    }
    $(".userlist").html(userlist.join(""));
    $(".username").each(function(){
      if($(this).attr("data-name") == name)
      $(this).attr("style","background:#E6DB74");
    });
    $(".userlist").css({'height':'0'}).show().animate({'height':'440px'});
  }
});

//打开消息盒
$(".chatbox").click(function(){
  var _this = $(this);
  var from_user = $("#avatar").attr("alt");
  $.get('/getchats?from_user='+from_user, function(ret){//读取聊天信息
    var old_chats = {};
    if(ret.result == 1){
      old_chats = ret.data;
    }
    //初始化一些数据
    if(typeof msg_count == "undefined")
      msg_count_old = 0;
    else
      msg_count_old = msg_count;
   
    if(typeof user_count == "undefined") user_count = 0;

    _this.hide();
    var p = [];
    if(user_count > 1){
      var userlist = [];
      var username = [];
      for(var key in user_msg){
         userlist.push("<span class='username' data-name="+key+">"+key+"<label class='deluser'>X</label></span>");
         username.push(key);
      }
      if($(".chatbox").html().match("您有")){
        var last_username = username[username.length-1];
        if(typeof old_chats[last_username] != "undefined"){
          //var message = old_chats[last_username].slice(-6);
          var message = old_chats[last_username];
          for(var k in message){
            if(typeof message[k].to_msg != "undefined")
              p.push('<div class="chatdiv" id="chatdiv"><p class="p1">'+message[k].to_msg+'</p><div>');
            if(typeof message[k].from_msg != "undefined")
              p.push('<div class="chatdiv" id="chatdiv"><p class="p2">'+message[k].from_msg+'</p><div>');
          }
        } else {
          for(var k in user_msg[last_username]){
            if(typeof user_msg[last_username][k].to_msg != "undefined")
              p.push('<div class="chatdiv" id="chatdiv"><p class="p1">'+user_msg[last_username][k].to_msg+'</p><div>');
            if(typeof user_msg[last_username][k].from_msg != "undefined")
              p.push('<div class="chatdiv" id="chatdiv"><p class="p2">'+user_msg[last_username][k].from_msg+'</p><div>');
          }
        }
        userlist[userlist.length-1] = "<span class='username' style='background:#E6DB74' data-name="+last_username+" id="+key+">"+last_username+"<label class='deluser'>X</label></span>";
        $(".userlist").html(userlist.join(""));
        $(".chatname").html(last_username);
      } else {
        var now_chat = $(".chatname").html();
        if(typeof old_chats[now_chat] != "undefined"){
          //var message = old_chats[now_chat].slice(-6);
          var message = old_chats[now_chat];
          for(var k in message){
            if(typeof message[k].to_msg != "undefined")
              p.push('<div class="chatdiv" id="chatdiv"><p class="p1">'+message[k].to_msg+'</p><div>');
            if(typeof message[k].from_msg != "undefined")
              p.push('<div class="chatdiv" id="chatdiv"><p class="p2">'+message[k].from_msg+'</p><div>');
          }
        } else {
          for(var k in user_msg[now_chat]){
            if(typeof user_msg[now_chat][k].to_msg != "undefined")
              p.push('<div class="chatdiv" id="chatdiv"><p class="p1">'+user_msg[now_chat][k].to_msg+'</p><div>');
            if(typeof user_msg[now_chat][k].from_msg != "undefined")
              p.push('<div class="chatdiv" id="chatdiv"><p class="p2">'+user_msg[now_chat][k].from_msg+'</p><div>');
          }
        }
        
        $(".userlist").html(userlist.join(""));
        $(".username").each(function(){
           if(_this.attr("data-name") == now_chat)
             _this.attr("style","background:#E6DB74");
        });
        $(".chatname").html(now_chat);
      }
     
      $(".sendlist").html(p.join(""));
      $(".sendbox").css("display","block");
      $(".userlist").css({'height':'0'}).show().animate({'height':'440px'});
      $(".sendbox").css({'height':'0'}).show().animate({'height':'440px'});
    } else if (user_count == 1 || $(".chatbox").html().match("您有")){
      console.log(old_chats);
      for(var key in user_msg){
        if(typeof old_chats[key] != "undefined"){
          //var message = old_chats[key].slice(-6);
          var message = old_chats[key];
          for(var k in message) {
            if(typeof message[k].to_msg != "undefined")
              p.push('<div class="chatdiv" id="chatdiv"><p class="p1">'+message[k].to_msg+'</p><div>');
            if(typeof message[k].from_msg != "undefined")
              p.push('<div class="chatdiv" id="chatdiv"><p class="p2">'+message[k].from_msg+'</p><div>');
          }
        } else {
          for(var k in user_msg[key]) {
            if(typeof user_msg[key][k].to_msg != "undefined")
              p.push('<div class="chatdiv" id="chatdiv"><p class="p1">'+user_msg[key][k].to_msg+'</p><div>');
            if(typeof user_msg[key][k].from_msg != "undefined")
              p.push('<div class="chatdiv" id="chatdiv"><p class="p2">'+user_msg[key][k].from_msg+'</p><div>');
          }
        }
        $(".chatname").html(key);
      }
      $(".sendlist").html(p.join(""));
      $(".sendbox").css("display","block");//使后面可以计算出 #sendlist的scrollTop    
    }
    $('#sendlist').scrollTop($('#sendlist')[0].scrollHeight+$('#chatdiv').height()+50);
    $(".sendbox").css({'height':'0'}).show().animate({'height':'440px'});
  });
});

//读取多人的消息
$(".username").live('click', function(){
  var name = $(this).attr("data-name");
  showUserMsg(name);
  $(".username").css("background","#FFF");
  $(this).css("background","#E6DB74");
});

$(".username").live('mouseover', function(){
  $(this).find(".deluser").show();
});

$(".username").live('mouseout', function(){
  $(this).find(".deluser").hide();
});

//删除某个聊天用户
$(".deluser").live('click', function(event){
  evt = event || window.event;
  stopBubble(evt);//阻止事件冒泡
  $(this).parent().remove();
  var from_user = $("#avatar").attr("alt");
  var del_user = $(this).parent().attr("data-name");
  var num = $(".username").length;
  if(num == 1) $(".userlist").hide();
  var username = $(".username").last().attr("data-name");
  showUserMsg(username);
  delete user_msg[del_user];
  del_name(del_user, chat_users);
  msg_count_old -= 1;
});

$(".gb").click(function(){
  $(".sendbox").hide();
  $(".userlist").hide();
  var del_user = $(".chatname").html();
  delete user_msg[del_user];
  del_name(del_user, chat_users);
  $('.username').each(function(){
    delete user_msg[$(this).attr('data-name')];
    del_name($(this).attr('data-name'), chat_users);
  });
  console.log(chat_users);
  msg_count_old = 0;
});

$(".zxh").click(function(){
   $(".sendbox").css({'height':'440px'}).hide().animate({'height':'0'});
   $(".userlist").css({'height':'440px'}).hide().animate({'height':'0'});       
   $(".chatbox").html($(".chatname").html());
   $(".chatbox").css({'height':'0'}).show().animate({'height':'25px'});
});

//发送消息
function sendmsg()
{
  var msg = $.trim($(".area").val());
  if(msg == ""){
      colorKit();
      return false;
  }
  $(".area").val("");
  var to = $(".chatname").html();
  socket.emit('message', {to:to,from:$("#avatar").attr("alt"),msg:msg});
  if(typeof user_msg[to] === "undefined"){
     user_msg[to] = new Array({"to_msg":msg});
  } else {
     user_msg[to].push({"to_msg":msg});
  }
}

function showUserMsg(name)
{
  var from_user = $("#avatar").attr("alt");
  $.get('/getchats?from_user='+from_user, function(ret){//读取聊天信息
    var old_chats = {};
    if(ret.result == 1){
      old_chats = ret.data;
    }
    var p = [];
    if(typeof old_chats[name] != "undefined"){
      //var message = old_chats[name].slice(-6);
      var message = old_chats[name];
      for(var k in message){
        if(typeof message[k].to_msg != "undefined")
          p.push('<div class="chatdiv" id="chatdiv"><p class="p1">'+message[k].to_msg+'</p><div>');
        if(typeof message[k].from_msg != "undefined")
          p.push('<div class="chatdiv" id="chatdiv"><p class="p2">'+message[k].from_msg+'</p><div>');
      }
    } else {
      for(var k in user_msg[name]){
          if(typeof user_msg[name][k].to_msg != "undefined")
            p.push('<div class="chatdiv" id="chatdiv"><p class="p1">'+user_msg[name][k].to_msg+'</p><div>');
          if(typeof user_msg[name][k].from_msg != "undefined")
            p.push('<div class="chatdiv" id="chatdiv"><p class="p2">'+user_msg[name][k].from_msg+'</p><div>');
      }
    }
    $(".chatname").html(name);
    $(".sendlist").html(p.join(""));
    $(".sendbox").css("display","block");//使后面可以计算出 #sendlist的scrollTop 
    $('#sendlist').scrollTop($('#sendlist')[0].scrollHeight+$('#chatdiv').height()+50);
  });
}

function showUserList()
{
  var userlist = [];
  for(var key in user_msg){
    userlist.push("<span class='username' data-name="+key+">"+key+"<label class='deluser'>X</label></span>");
  }
  var now_chat = $(".chatname").html();
  $(".userlist").html(userlist.join(""));
  $(".username").each(function(){
    if($(this).attr("data-name") == now_chat)
    $(this).attr("style","background:#E6DB74");
  });
  $(".userlist").show();
}

//输入框警告提示
function colorOn()
{
    $(".area").css("background","rgb(255, 211, 211)");
    Times++;
    window.setTimeout("colorOff()", 100);
}

function colorOff()
{
    $(".area").css("background","#FFF");
    if(Times < 3) window.setTimeout("colorOn()", 100);
}

function colorKit()
{
    Times = 0;
    window.setTimeout("colorOn()", 100);
}

//阻止事件冒泡
function stopBubble(e){  
  if(document.attachEvent) {//ie  
      e.cancelBubble = true;  
  } else {
      e.stopPropagation();  
  }
}

//保存聊天信息
function savechats(from_user, to_user, user_msg){
  $.post('/setchats', {"from_user":from_user,"to_user":to_user,"user_msg":user_msg}, function(ret){});
}

function in_names(name, names)
{
  for(var key in names){
     if(name == names[key]) return true;
  }
  return false;
}

function del_name(name, names){
  for(var key in names){
    if(name == names[key]) chat_users = names.slice(0, key);
  }
}