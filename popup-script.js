
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




    $("#btnAddRule").click(function(){

        sendMessageToContentScript('btnAddRule--'+$("#keywords").val(), (response) => {

            if(response!=undefined){
                $("#keywordContaner").empty();
                var tar=JSON.parse(response);
                var len=tar.length;
                for ( var i = 0; i < len; i++) {
                    $("#keywordContaner").append($('<button type="button" class="btn btn-outline-danger btn-sm">'+tar[i]+'</button>'));
                }
            }


        });
    });

    $("#btnExe").click(function(){

        sendMessageToContentScript('btnExe', (response) => {



        });
    });


    sendMessageToContentScript('queryState', (response) => {

        if(response!=undefined&&response==true){
            $("#btnExe").removeClass("badge-light");
            $("#btnExe").addClass("badge-success");
            $("#btnExe").text("正在执行");
        }

    });
    $("#nav-profile-tab").click(function(){
        sendMessageToContentScript('queryKeys', (response) => {

            if(response!=undefined){
                $("#keywordContaner").empty();
                var tar=JSON.parse(response);
                var len=tar.length;
                for ( var i = 0; i < len; i++) {
                    $("#keywordContaner").append($('<button type="button" class="btn btn-outline-danger btn-sm">'+tar[i]+'</button>'));
                }
            }

        });
    });



});