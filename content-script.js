
$(document).ready(function(){
    var state=false;

    function muteSomeOne(id,room_id,time){
        $.ajax({
            type: "POST",
            url: "https://www.douyu.com/room/roomSetting/addMuteUser",
            data: {"ban_nickname":id,"room_id":room_id,"ban_time":time},
            dataType: "json",
            success: function(datax){

                console.log(datax.msg);

            }

        });
    }

    function getBarrageInfo(target){
        if(target!=undefined){
            var nickName=$.trim(target.find(".Barrage-nickName").text());
            var content=$.trim(target.find(".Barrage-content").text());
            if(filterKey(content)){
                muteSomeOne( nickName );
            }
        }
    }
    function execKeyword(){
        var target,target1,target2,target3,target4,target5
        if($("#js-barrage-list").children()!=undefined){
            target=$("#js-barrage-list").children().last();

        }
        if(target!=undefined){
            getBarrageInfo(target)
            target1=target.prev();
        }

        if(target1!=undefined){
            getBarrageInfo(target1)
            target2=target1.prev();
        }
        if(target2!=undefined){
            getBarrageInfo(target2)
            target3=target2.prev();
        }
        if(target3=undefined){
            getBarrageInfo(targe3)
            target4=target3.prev();
        }
        if(target4=undefined){
            getBarrageInfo(target4)
            target5=target4.prev();
        }
        if(target5=undefined){
            getBarrageInfo(target5)

        }
    }

    function filterKey(target){
        var pattenStrCollection;
        pattenStrCollection=JSON.parse(window.localStorage.getItem("pattenStrCollection"));


        for(var i=0,len=pattenStrCollection.length;i<len;i++){

            var reg =new RegExp(pattenStrCollection[i]);
                var result = reg.test(target);
                if(result){
                    //alert(window.localStorage.getItem(key)+"________"+target);
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

    function addKey(patten){
        if(patten!=undefined && $.trim(patten)!=""){
            var pattenStrCollection;
            pattenStrCollection=JSON.parse(window.localStorage.getItem("pattenStrCollection"));
            if(arrContains(pattenStrCollection,patten)==false){
                console.log( typeof pattenStrCollection);
                pattenStrCollection.push(".*"+patten+".*");
                window.localStorage.setItem("pattenStrCollection" , JSON.stringify(pattenStrCollection));

            }
        }
    }
    // 监听消息
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
    {
        var pattenStrCollection;
        pattenStrCollection=window.localStorage.getItem("pattenStrCollection");

        if(pattenStrCollection==undefined||$.trim(pattenStrCollection)==""){

            window.localStorage.removeItem("pattenStrCollection");
            var arr=[];
            window.localStorage.setItem("pattenStrCollection",JSON.stringify(arr));
        }
        if(request.indexOf("btnAddRule")>=0){

            var tar=request.split("--");
            addKey(tar[1]);
            sendResponse(window.localStorage.getItem("pattenStrCollection" )) ;
        }
        if(request=="btnExe"){
            state=true;
            var pattenStrCollection =window.localStorage.getItem("pattenStrCollection");

            setInterval(execKeyword,2000) ;
        }
        if(request=="queryState"){
            sendResponse(state) ;

        }
        if(request=="queryKeys"){
            sendResponse((window.localStorage.getItem("pattenStrCollection"))) ;

        }
       /* */

    });

});





