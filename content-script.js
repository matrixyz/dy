
$(document).ready(function(){
    var state=false;
    var muteUser=[];
    function muteSomeOne(nickname,room_id,time){
        console.log({"ban_nickname":nickname,"room_id":room_id.replace('r',''),"ban_time":time});
        $.ajax({
            type: "POST",
            url: "https://www.douyu.com/room/roomSetting/addMuteUser",
            data: {"ban_nickname":nickname,"room_id":room_id.replace('r',''),"ban_time":time},
            dataType: "json",
            success: function(datax){
                console.log(datax.msg);
            }
        });
    }

    function getBarrageInfo(target,room_id){
        if(target!=undefined){
            var nickName=$.trim(target.find(".Barrage-nickName").text());
            if(nickName!=undefined)
                nickName=nickName.replace("：","");
            var content=$.trim(target.find(".Barrage-content").text());
            var hasFansMedal=target.find(".FansMedal").length==0?false:true;
            var userLevel;
            if(target.find(".UserLevel")!=undefined){
                if(target.find(".UserLevel").attr("title")==undefined)
                    userLevel=1;
                else
                    userLevel=$.trim(target.find(".UserLevel").attr("title").replace("用户等级：",""));
            }
            console.log(nickName+'-'+content+'-'+hasFansMedal+'-'+userLevel);
            if(filterKey(content,room_id,false,hasFansMedal,userLevel)){
                if(muteUser.indexOf(nickName)<0){
                    muteSomeOne( nickName,room_id,roomWithKeyword[room_id][2] );
                    muteUser.push(nickName);
                }

            }
        }
    }
    function execKeyword(room_id){
        var target,target1,target2,target3,target4,target5
        if($("#js-barrage-list").children()!=undefined){
            target=$("#js-barrage-list").children().last();

        }
        if(target!=undefined){
            getBarrageInfo(target,room_id);
            target1=target.prev();
        }

        if(target1!=undefined){
            getBarrageInfo(target1,room_id);
            target2=target1.prev();
        }
        if(target2!=undefined){
            getBarrageInfo(target2,room_id);
            target3=target2.prev();
        }
        if(target3=undefined){
            getBarrageInfo(targe3,room_id);
            target4=target3.prev();
        }
        if(target4=undefined){
            getBarrageInfo(target4,room_id);
            target5=target4.prev();
        }
        if(target5=undefined){
            getBarrageInfo(target5,room_id);

        }
    }
    //判断抓取到的关键字在指定房间规则里是否符合过滤条件
    function filterKey(targetStr,room_id,pattenEnable,hasFansMedal,userLevel){

        if(targetStr!=undefined && $.trim(targetStr)!=""){
            var roomObj=roomWithKeyword[room_id];
            if(roomObj!=undefined){
                var flag=false;

                if( roomWithKeyword[room_id][1]=="需要粉丝牌"&&hasFansMedal){//房间用户有粉丝牌的话就不需要过滤了
                    return false;
                }
                if(roomWithKeyword[room_id][2]!="不限级别"&&(analyeseLevel(roomWithKeyword[room_id][0] ,userLevel)==false)){//不在拦截范围的用户的话就不需要过滤了
                    return false;
                }
                if(pattenEnable){//开启正则验证的功能
                    var len=roomObj.length;
                    for(var i=5;i<len;i++){
                        var reg =new RegExp(roomObj[i]);
                        var result = reg.test(targetStr);
                        if(result){
                            flag=true;
                            break;
                        }
                    }
                }else{
                    var len=roomObj.length;
                    for(var i=5;i<len;i++){
                        var index = targetStr.indexOf(roomObj[i]);
                        if (index > -1) {
                            flag=true;
                            break;
                        }

                    }

                }

                return flag;
            }
        }
        return false;
    }
    function analyeseLevel(str,currLevel) {
        if(str!=undefined  ){
            var l=str.split("-");

            if(/\d+/g.test(l[0]+l[1]+currLevel)==false){
                return false;
            }

            var s=parseInt(l[0]);
            var e=parseInt(l[1]);
            var c=parseInt(currLevel);
            //console.log(s+'-'+c+'-'+e);
            if(e>=c&&s<=c){
                return true;
            }
        }
        return false;
    }
    function  arrContains(arr,tar) {
        if(arr!=undefined&&arr instanceof Array ){
            var len=arr.length;
            for ( var i = 0; i < len; i++) {
                if(arr[i]==tar){
                    return true;
                }
            }
        }
        return false;
    }

    function addKey(patten,room_id){
        if(patten!=undefined && $.trim(patten)!=""){
            var roomObj=roomWithKeyword[room_id];
            if(roomObj!=undefined){
                if(arrContains(roomObj,patten)==false){
                    roomObj.push(patten);
                    saveRoomWithKeywordToPattenStrCollection();

                }
            }else{

                roomObj=getRoomArray();
                roomObj.push(patten);//第六个位置开始为禁言关键字
                roomWithKeyword[room_id]=roomObj;
                saveRoomWithKeywordToPattenStrCollection();

            }
        }
    }
    //设定指定房间关键字参数
    function setKeywordPattenParam(room_id,param,type) {
        var roomObj=roomWithKeyword[room_id];
        if(roomObj==undefined){
            roomObj=getRoomArray();
            roomWithKeyword[room_id]=roomObj;
        }
        if(type=="级别"){
            roomObj[0]=param;
        }else if(type=="粉丝牌"){
            roomObj[1]=param;
        }else if(type=="时间"){
            roomObj[2]=param;
        }
        saveRoomWithKeywordToPattenStrCollection();
    }
    function getRoomArray() {
        var roomObj=new Array();
        roomObj.push("不限级别");
        roomObj.push("无需粉丝牌");
        roomObj.push("30");//禁言时间默认30分钟
        roomObj.push("0");//房间执行状态
        roomObj.push("占位2");
        return roomObj;
    }
    //删除指定房间的指定关键词
    function removePatten(patten,room_id) {
        if(patten!=undefined && $.trim(patten)!=""){
            var roomObj=roomWithKeyword[room_id];
            if(roomObj!=undefined){
                var index = roomObj.indexOf(patten);
                if (index > -1) {
                    roomObj.splice(index, 1);
                }
            }
        }
    }
    //删除字符串作为索引的
    function removeEleInStrindexArr(){

    }
    function saveRoomWithKeywordToPattenStrCollection(){
        window.localStorage.setItem("pattenStrCollection",JSON.stringify(roomWithKeyword));

    }
    // 监听消息
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
    {
        if(request.indexOf("btnAddRoom")>=0){

            var room=request.split("--");
            addKey("xxx",room[1]);
            console.log(roomWithKeyword);
            roomWithKeyword[room[1]][3]=0;

        }
        if(request.indexOf("btnDelRoom")>=0){

            var room=request.split("--");

            delete roomWithKeyword[room[1]] ;
            saveRoomWithKeywordToPattenStrCollection();

        }
        if(request.indexOf("btnDelKeyInRoom")>=0){

            var tar=request.split("--");
            var keys=roomWithKeyword[tar[1]];
            var index=parseInt(tar[2]);
            console.log(keys);
               keys.splice(index,1) ;
            saveRoomWithKeywordToPattenStrCollection();

        }
        if(request.indexOf("btnAddRule")>=0){

            var tar=request.split("--");
            tar[1]=tar[1].replace("，",",");
            if(tar[1].indexOf(",") ){
                var tara=tar[1].split(",");
                for(let x in tara){
                    addKey(tara[x],tar[2]);
                }
            }else{
                addKey(tar[1],tar[2]);
            }

            sendResponse(roomWithKeyword) ;
        }
        if(request.indexOf("btnSetFansMedal")>=0){

            var tar=request.split("--");
            if(roomWithKeyword[tar[1]][1]=="需要粉丝牌"){
                roomWithKeyword[tar[1]][1]="不需粉丝牌";
            }else{
                roomWithKeyword[tar[1]][1]="需要粉丝牌"
            }
            console.log(roomWithKeyword[tar[1]] );
            sendResponse(roomWithKeyword) ;
        }
        if(request.indexOf("btnAddLevelRule")>=0){

            var tar=request.split("--");
            roomWithKeyword[tar[1]][0]=tar[2];
            sendResponse(roomWithKeyword) ;
        }
        if(request.indexOf("btnAddTimeRule")>=0){

            var tar=request.split("--");
            roomWithKeyword[tar[1]][2]=tar[2];
            sendResponse(roomWithKeyword) ;
        }
        if(request.indexOf("btnExe")>=0){

            var info=request.split("--");
            roomIntervalIdForExecState[info[1]]=setInterval(function(){
                execKeyword(info[1]);
            },2000) ;
            roomWithKeyword[info[1]][3]=1;
        }
        if(request.indexOf("btnUnExe")>=0){

            var info=request.split("--");
            clearInterval(roomIntervalIdForExecState[info[1]]);
            roomWithKeyword[info[1]][3]=0;
        }
        if(request.indexOf("btnAllExe")>=0){

            for(let room in roomWithKeyword){
                roomWithKeyword[room][3]=1;
                roomIntervalIdForExecState[room]=setInterval(function(){
                    execKeyword(room);
                },2000) ;
            }

        }
        if(request.indexOf("btnUnAllExe")>=0){

            for(let room in roomIntervalIdForExecState){
                if(roomIntervalIdForExecState[room]!=undefined)
                    clearInterval(roomIntervalIdForExecState[room]);
            }

           for(let room in roomWithKeyword){
               roomWithKeyword[room][3]=0;
           }
            saveRoomWithKeywordToPattenStrCollection();

        }
        sendResponse(roomWithKeyword) ;
       /* */

    });
    var pattenStrCollection;
    var roomWithKeyword;//房间号及对应的规则数据
    var roomIntervalIdForExecState;//房间执行函数句柄

    pattenStrCollection=window.localStorage.getItem("pattenStrCollection");
   // window.localStorage.removeItem("pattenStrCollection");
    if(pattenStrCollection==undefined||$.trim(pattenStrCollection)==""){

        //window.localStorage.removeItem("pattenStrCollection");
        var arr={};
        roomIntervalIdForExecState=[];

        window.localStorage.setItem("pattenStrCollection",JSON.stringify(arr));
        roomWithKeyword=arr;
        console.log("浏览器首次使用斗鱼小助手，初始化 pattenStrCollection 成功...");
    }else{
        if(roomWithKeyword==undefined||roomWithKeyword==null){
            roomWithKeyword=JSON.parse(window.localStorage.getItem("pattenStrCollection"));
            //console.log(roomWithKeyword);
            roomIntervalIdForExecState=[];
        }

    }

});





