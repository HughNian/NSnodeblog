//javascript document

//建立websocket连接
socket = io.connect('http://127.0.0.1:3000');

user_msg = {};//全局用户聊天信息对象

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
   console.log('client get message'+msg);
   var p = '<div class="chatdiv" id="chatdiv"><p class="p2">'+msg+'</p><div>';
   $(".sendlist").append(p);
   $('#sendlist').scrollTop($('#sendlist')[0].scrollHeight+$('#chatdiv').height()+50);//到scroll底部
});

//点击用户头像打开聊天窗口
$(".avatar").live('click', function(){
  $(".chatname").html($(this).attr('title'));
  $(".sendbox").css({'height':'0'}).show().animate({'height':'440px'});
});

//打开消息盒
$(".chatbox").click(function(){
   var now_user = $("#avatar").attr("alt");
   var old_chats = getchats(now_user);
   //console.log(old_chats);
   //初始化一些数据
   if(typeof msg_count == "undefined")
      msg_count_old = 0;
   else
      msg_count_old = msg_count;
   
   if(typeof user_count == "undefined") user_count = 0;

   $(this).hide();
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
        userlist[userlist.length-1] = "<span class='username' style='background:#E6DB74' data-name="+last_username+" id="+key+">"+last_username+"<label class='deluser'>X</label></span>";
        $(".userlist").html(userlist.join(""));
        for(var k in user_msg[last_username]){
        if(typeof user_msg[last_username][k].to_msg != "undefined")
          p.push('<div class="chatdiv" id="chatdiv"><p class="p1">'+user_msg[last_username][k].to_msg+'</p><div>');
        if(typeof user_msg[last_username][k].from_msg != "undefined")
          p.push('<div class="chatdiv" id="chatdiv"><p class="p2">'+user_msg[last_username][k].from_msg+'</p><div>');
        }
        $(".chatname").html(last_username);
     } else {
        var now_chat = $(".chatname").html();
        $(".userlist").html(userlist.join(""));
        $(".username").each(function(){
           if($(this).attr("data-name") == now_chat)
             $(this).attr("style","background:#E6DB74");
        });
        for(var k in user_msg[now_chat]){
        if(typeof user_msg[now_chat][k].to_msg != "undefined")
          p.push('<div class="chatdiv" id="chatdiv"><p class="p1">'+user_msg[now_chat][k].to_msg+'</p><div>');
        if(typeof user_msg[now_chat][k].from_msg != "undefined")
          p.push('<div class="chatdiv" id="chatdiv"><p class="p2">'+user_msg[now_chat][k].from_msg+'</p><div>');
        }
        $(".chatname").html(now_chat);
     }
     
     $(".sendlist").html(p.join(""));
     $(".sendbox").css("display","block");
     $(".userlist").css({'height':'0'}).show().animate({'height':'440px'});
     $(".sendbox").css({'height':'0'}).show().animate({'height':'440px'});
   } else if (user_count == 1 || $(".chatbox").html().match("您有")){
     for(var key in user_msg){
        for(var k in user_msg[key]){
          if(typeof user_msg[key][k].to_msg != "undefined")
            p.push('<div class="chatdiv" id="chatdiv"><p class="p1">'+user_msg[key][k].to_msg+'</p><div>');
          if(typeof user_msg[key][k].from_msg != "undefined")
            p.push('<div class="chatdiv" id="chatdiv"><p class="p2">'+user_msg[key][k].from_msg+'</p><div>');
        }
        $(".chatname").html(key);
     }
     $(".sendlist").html(p.join(""));
     $(".sendbox").css("display","block");//使后面可以计算出 #sendlist的scrollTop    
   }
   $('#sendlist').scrollTop($('#sendlist')[0].scrollHeight+$('#chatdiv').height()+50);
   $(".sendbox").css({'height':'0'}).show().animate({'height':'440px'});
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
  var del_user = $(this).parent().attr("data-name");
  delete user_msg[del_user];
  user_count -= 1;
  var num = $(".username").length;
  if(num == 1) $(".userlist").hide();
  var username = $(".username").last().attr("data-name");
  showUserMsg(username);
});

$(".gb").click(function(){
   $(".sendbox").css({'height':'440px'}).hide().animate({'height':'0'});
   $(".userlist").css({'height':'440px'}).hide().animate({'height':'0'});
   var now_user = $("#avatar").attr("alt");
   savechats(now_user, user_msg);
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
  var p = [];
  for(var k in user_msg[name]){
      if(typeof user_msg[name][k].to_msg != "undefined")
        p.push('<div class="chatdiv" id="chatdiv"><p class="p1">'+user_msg[name][k].to_msg+'</p><div>');
      if(typeof user_msg[name][k].from_msg != "undefined")
        p.push('<div class="chatdiv" id="chatdiv"><p class="p2">'+user_msg[name][k].from_msg+'</p><div>');
  }
  $(".chatname").html(name);
  $(".sendlist").html(p.join(""));
  $(".sendbox").css("display","block");//使后面可以计算出 #sendlist的scrollTop 
  $('#sendlist').scrollTop($('#sendlist')[0].scrollHeight+$('#chatdiv').height()+50);
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
function savechats(from_user, user_msg){
  console.log(user_msg);
  $.post('/setchats', {"from_user":from_user,"user_msg":user_msg}, function(ret){});
}

//读取聊天信息
function getchats(from_user){
  $.get('/getchats?from_user='+from_user, function(ret){
    console.log(ret);
  });
}