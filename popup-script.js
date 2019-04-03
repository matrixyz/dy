
$(document).ready(function(){

    function getCurrentTabId(callback) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { if(callback) callback(tabs.length ? tabs[0].id: null); });
    }
    function sendMessageToContentScript(message, callback) {
        getCurrentTabId((tabId) =>{
            chrome.tabs.sendMessage(tabId, message, function(response)
            {
                if(callback) callback(response);
            });
        });
    }







    function fillRoomStateContainer(response){
        if(response!=undefined ){
            $("#nav-home").empty();
            var btnExeAll=$(' <button type="button" class="btn btn-primary   " style="margin-top:5px;" id="btnExeAll">执行所有房间规则</button>');
            btnExeAll.on("click", function(){
                sendMessageToContentScript('btnAllExe'  , (response) => {
                    fillRoomStateContainer(response);

                });
            });
            $("#nav-home").append(btnExeAll);

            for (let room in response){
                if(response[room][3]==1||response[room][3]=="1"){
                    var dom=$('<button type="button" class="btn btn-success" style="margin-top:5px;" title="'+room+'">房间号'+room+'<span class="badge badge-danger">执行中</span></button>');
                    var id=room;
                    dom.on("click", function(){
                        sendMessageToContentScript('btnUnExe--'+$(this).attr("title")   , (response) => {
                            fillRoomStateContainer(response);

                        });
                    });
                    $("#nav-home").append(dom);
                }else{

                    var dom=$('<button type="button" class="btn btn-warning" style="margin-top:5px;" title="'+room+'">房间号'+room+'<span class="badge badge-secondary">未执行</span></button>');
                    var x=room;
                    dom.on("click", function(){

                        sendMessageToContentScript('btnExe--'+$(this).attr("title")   , (response) => {
                            fillRoomStateContainer(response);

                        });
                    });
                    $("#nav-home").append(dom);
                }
            }
        }
    }

    sendMessageToContentScript('btnUnAllExe', (response) => {
        fillRoomStateContainer(response);
        fillRoomContainer(response,"roomIdsContent");

    });
    $("#btnAddRoom").click(function(){


        if(/^\d{1,9}$/g.test($.trim($("#roomid").val()))==false){
            alert("房间号必须为正整数！");
            return false;
        }
        var roomid='r'+$("#roomid").val();

        if($("#roomIdsContent").find("button[title='"+roomid+"']").length>0){
            alert("房间号已存在！");
        }else{
            sendMessageToContentScript('btnAddRoom--'+roomid, (response) => {

                fillRoomContainer(response,"roomIdsContent");

            });
        }

    });
    $("#nav-room-tab").click(function(){
        sendMessageToContentScript('queryRooms', (response) => {

            fillRoomContainer(response,"roomIdsContent");
        });
    });
    function delroom(room) {
        if(room!=undefined){

            sendMessageToContentScript('btnDelRoom--'+room, (response) => {

                fillRoomContainer(response,"roomIdsContent");
            });
        }
    }
    function fillRoomContainer(response,contanerId) {

        if(response!=undefined){
            $("#"+contanerId).empty();
            for (let room in response){
                var dom=null;
                if(contanerId=="roomIdsContent"){
                    dom=$('<button type="button" class="btn btn-warning" title="'+room+'">房间号'+room+'<span class="badge badge-danger">删除</span></button>');
                    const id=room;
                    dom.find("span").on("click", function(){
                        delroom(id);
                    });
                }else if(contanerId=="keywordMapRoomContainer"){
                    dom=$('<button type="button" class="btn btn-warning" title="'+room+'">房间号'+room+'</button>');
                    const id=room;
                    dom.on("click", function(){
                        getRoomKeys(id);
                        $(this).removeClass("btn-warning");
                        $(this).addClass("btn-success");
                        $(this).siblings().removeClass("btn-success");
                        $(this).siblings().addClass("btn-warning");
                    });
                }

                $("#"+contanerId).append(dom);
            }
        }
    }
    $("#nav-profile-tab").click(function(){
        sendMessageToContentScript('queryRooms', (response) => {

            fillRoomContainer(response,"keywordMapRoomContainer");

        });
    });
    $("#nav-log-tab").click(function(){
        sendMessageToContentScript('qbtn', (response) => {
            //console.log(response);
            $("#logList").empty();
            var row;
            var i=0;
            for (let x in response) {
                i++;
                if(i>20)
                    break;
                 row+="<tr>";
                for (let y in response[x]) {
                    row+="<td>"+response[x][y]+"</td>";
                }
                row+="</tr>";

            }

            $("#logList").html(row);
        });
    });
    $("#btnQueryMuteLog").click(function(){
        sendMessageToContentScript('qbtn', (response) => {
            //console.log(response);
            var tar=$.trim($("#username").val());

            var flag=false;
            for (let x in response) {
                if( response[x][0]==tar){
                    flag=true;
                    $("#logList").empty();
                    var row="<tr><td>"+ response[x][0]+"</td><td>"+ response[x][1]
                        +"</td><td>"+ response[x][2]+"</td><td>"+ response[x][3]+"</td></tr>"
                    $("#logList").html(row);

                    break;
                }
            }
            if(flag==false)
                alert("没有查到数据！");
        });
    });
    //清空禁言日志
    $("#btnClearMuteLog").click(function(){
        sendMessageToContentScript('ClearMuteLog', (response) => {
            $("#logList").empty();
        });
    });


    //添加关键字
    $("#btnAddRule").click(function(){
        if($.trim($("#keywords").val())==""){
            alert("关键字不能为空！");
            return false;
        }

       if($("#keywordMapRoomContainer").find("button[class='btn btn-success']").length==0){
           alert("请先选择房间！");
           return false;
       }
        var roomid=$("#keywordMapRoomContainer").find("button[class='btn btn-success']").attr("title");
        sendMessageToContentScript('btnAddRule--'+$.trim($("#keywords").val().replace("--",""))+'--'+roomid, (response) => {

            getRoomKeys( roomid );
        });
    });
    //添加粉丝牌
    $("#btnAddFansRule").click(function(){
       if($("#keywordMapRoomContainer").find("button[class='btn btn-success']").length==0){
           alert("请先选择房间！");
           return false;
       }
        var roomid=$("#keywordMapRoomContainer").find("button[class='btn btn-success']").attr("title");
        sendMessageToContentScript('btnSetFansMedal--'+roomid  , (response) => {
            getRoomKeys( roomid );
        });


    });
    //添加禁言级别
    $("#btnAddLevelRule").click(function(){
        var level=$.trim($("#inputAddLevelRule").val());
        if(level==""){
            alert("级别不能为空！");
            return false;
        }
        if(/^\d{1,3}-\d{1,3}$/.test(level)==false&&level!="不限级别"){
            alert("级别格式必须为  m-n  或 不限级别");
            return false;
        }
       if($("#keywordMapRoomContainer").find("button[class='btn btn-success']").length==0){
           alert("请先选择房间！");
           return false;
       }
        var roomid=$("#keywordMapRoomContainer").find("button[class='btn btn-success']").attr("title");
        sendMessageToContentScript('btnAddLevelRule--'+roomid+'--'+$.trim($("#inputAddLevelRule").val())  , (response) => {
            getRoomKeys( roomid );
        });
    });
    //添加禁言时间
    $("#btnAddTimeRule").click(function(){

       if($("#keywordMapRoomContainer").find("button[class='btn btn-success']").length==0){
           alert("请先选择房间！");
           return false;
       }
        var roomid=$("#keywordMapRoomContainer").find("button[class='btn btn-success']").attr("title");
        sendMessageToContentScript('btnAddTimeRule--'+roomid+'--'+$.trim($("#selectMuteTime").val())  , (response) => {
            getRoomKeys( roomid );
        });
    });

    $("#btnLike").click(function(){
        sendMessageToContentScript('btnLikeExe--test' , (response) => {



        });

    });


    //根据房间id获取房间的禁言关键词
    function getRoomKeys(room) {
        if(room!=undefined){

            sendMessageToContentScript('getRoomKeys', (response) => {


                if(response!=undefined) {
                    $("#roomsMapKeywords" ).empty();
                    var keys=response[room];
                    var len=keys.length;
                    for(var i=0;i<len;i++){
                        var dom=null;
                        const id=room;
                        if(i<6){

                            if(i==0){
                                dom=$(' <button type="button" class="btn btn-success ">级别'+keys[i]+'</button>');
                            }else if(i==2){
                                dom=$(' <button type="button" class="btn btn-success ">禁言时间'+convertTime(keys[i])+'</button>');
                            }else if(i==1){
                                dom=$(' <button type="button" class="btn btn-success ">'+keys[i]+'</button>');
                            }
                        }else{
                            dom=$(' <button type="button" class="btn btn-primary ">'+keys[i]+'<span class="badge badge-danger" title="'+ i +'">删除</span></button>');
                            dom.find("span").on("click", function(){
                                sendMessageToContentScript('btnDelKeyInRoom--'+id+'--'+ $(this).attr("title")  , (response) => {

                                    getRoomKeys( id );
                                });
                            });
                        }


                        $("#roomsMapKeywords").append(dom);
                    }


                }


            });
        }
    }
    //将分钟转换为小时或者天
    function convertTime(minute) {
        if(minute!=undefined){
            if(/\d/.test(minute)){
                var m=parseInt(minute);
                if(m>59&&m<1440){
                    return (minute/60)+"小时";
                }else if(m>1439){
                    return (minute/(60*24))+"天";
                }else{
                    return minute+"分";
                }
            }
        }
        return "1分";
    }
});