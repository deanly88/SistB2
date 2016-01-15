
/**
 *  멤버 관련된 소켓들 - 작성자 이남영
 * 
 */ 
$(function(){
    // var socket = io.connect('https://sistb2-deanly88.c9users.io:8080');
    
    //초기화
    var $pagingCnt = $('#pagingCnt');
    var $connectCnt = $('#connectCnt');
    var $memberCnt = $('#memberCnt');
    var $header_message_button = $('#header_message_button');
    var $header_message_view = $('#header_message_view');
    var $window_group_send = $('#window_group_send');
    
    
/**
 * 그룹 기능
 */
    
    // 버튼( 초대, , 탈퇴)
    
    
    // 그룹리스트 - 초대버튼 클릭으로 초대 윈도우 실행
    $('#btn_group_join_res').click(function(event) {
        $window_group_send.css('display','block');
    });
    $window_group_send.mouseover(function(){
        $('#text_group_join_mid').focus();
    })
    
    // 초대 윈도우 취소
    $window_group_send.click(function(event) {
        console.log(event.toElement.id);
        if(event.toElement.id != 'text_group_join_mid')
            $window_group_send.css('display','none');
    })
    
    // 초대 윈도우 
    $('#btn_group_join_send').click(function(event) {
        var mid = $('text_group_join_mid').val(); 
        
    });
    
    //2 그룹 맺기 요청 받음 (제공: 수락, 거절 버튼)
    socket.on('group_join_receive', function(data) {
        // view를 만들어줌
        console.log(data);
        $('#window_group_receive').css('display','block');
        $('#text_group_receiver').text(data.sender);
        $('#text_group_receive_time').text(data.date);
        
    });
    
    //3 그룹 맺기 요청 수락 / jqeury .click
    $('#btn_group_join_accept').click(function(event) {
        socket.emit('group_join_accept',{
            'sender': $('#text_group_receiver').text()
        });
        $('#window_group_receive').css('display','none');
        
    });
    
    
    //3 그룹 맺기 요청 거절 / jqeury .click
    $('#btn_group_join_reject').click(function(event) {
        socket.emit('group_join_reject',{
            'sender': $('#text_group_receiver').text()
        });
        $('#window_group_receive').css('display','none');
    });
    
    //1 그룹 맺기 요청 보내기 ()
    $('#btn_group_join_send').click(function(event) {
        console.log($('#text_group_join_mid').val());
        // 나중에 함수로 바꾸기. return) nick
        var receiver = $('#text_group_join_mid').val();
        socket.emit('group_join_send',{
            'receiver':receiver
        });
        $('#text_group_join_mid').val('');
    });
    
    // 그룹 탈퇴 
    $('#btn_group_join_leave').click(function(event) {
        // 확인 창 띄우기
        socket.emit('group_join_leave');
    });
    
    // 그룹 정보 받기
    socket.on('refresh',function(data) {
        $('#header_group').empty();
        var list = '<div class="notify-arrow notify-arrow-green"></div><li id="hr_list_group"><p class="green">그룹</p></li>'
        
        list +='<li class="external">\
                        <input id="btn_group_join_res" style="padding: 7px 10px !important; float: left; width:50px ;" type="button" class="btn btn-success btn-xs" value="초대"/>\
                        <input id="btn_group_join_leave" style="padding: 7px 10px !important; float: left; width:50px ;" type="button" class="btn btn-danger btn-xs" value="탈퇴"/>\
                    </li>'
        $('#header_group').append(list);
        socket.emit('refresh');
    })
    socket.on('group_info_list',function(data){
        console.log(data);
        if(!data.im){
            $('#cnt_member').text('');
            var list = '<li id="hr_nolist"><a href="#"><label class="control-label">그룹이 없습니다.</label></a></li>';
            $('#hr_list_group').after(list);
        }else{
            var count = data.info.length;
            $('#cnt_member').text(count);
            
            data.info.forEach(function(element){
                // console.log(element)
                // var wday = getCalDate(element.wday);
                var list = '<li id="hr_nolist"><a href="#"><span class="glist_photo"><img alt="avatar" \
                            style="height:40px; width:40px" src="/uploads/profiles/'+
                            element.myphoto+'"></span><span class="glist_nick" \
                            style="padding-left:20px; font-size:17px">'+element.nick+'<br>';
                if(element.state == 'on'){
                    list += '<i class="fa fa-circle" style="color:blue; padding-left:4px; font-size:14px"> online</i></span></a></li>';
                }else{
                    list += '<i class="fa fa-circle" style="color:gray; padding-left:4px; font-size:14px"> offline</i></span></a></li>';                
                }
                $('#hr_list_group').after(list);
            })
        }
    });
    // 그룹이 없으면 요청중인 리스트 출력
    
    /**2그룹 인원 2명
     * 메세지 기능
     */
    socket.on('test', function(data){
        alert(data) ;
    });
    socket.on('error_msg',function(data){
        $('#error_msg').text(data.error_msg);
    });
    socket.on('getMessages',function(data){
        console.log(data.msgs);
        data.msgs.forEach(function(element){
            // console.log(element)
            // var wday = getCalDate(element.wday);
            var list = '';
            if(element.gid){
                list = '<li style="background:rgba(252,255,119,0.61);"> &nbsp;Group Message'
            }else{
                list = '<li>'
            }
            list += '<a href="#"><span class="photo"><img alt="avatar" src="/uploads/profiles/'+
                        element.myphoto+'"><pre class="message">'+element.msg+'</pre></span><span class="subject"><span class="from">'+element.nick+'</span><span class="time">'+
                        element.date+'</span></span></a></li>';
            $('#hr_msglist').after(list);
            var count = $('#cnt_newmsg').text();
            if(element.new){count = Number(count) + 1;}
            $('#cnt_newmsg').text(count);
        })
    });
    socket.on('conn_people',function(data){
        $pagingCnt.empty();
        $pagingCnt.append(data.paging);
        $connectCnt.empty();
        $connectCnt.append(data.conns);
        $memberCnt.empty();
        $memberCnt.append(data.members);
    });
    $('#hr_icon_msg').click(function(event){
        $('#cnt_newmsg').empty();
        socket.emit('readedAll');
    });
    
    // 클릭하면 안사리지게 하기 (bootstrap보다 상위클래스에 보이는 스타일 지정)
    $('#hr_msg').click(function(event) {
        $header_message_view.css('display','block');
    });
    $('#hr_tocli').click(function(event) {
        $header_message_view.css('display','block');
    });
    
    $header_message_button.click(function(event) {
        var temp = $header_message_view.css('display');
        if(temp == 'none'){
            $header_message_view.css('display','block');
        }else{
            $header_message_view.css('display','none');
        }
    });
    $header_message_button.mousemove(function(){
        // mousemove 나중에 수정해주기
        // console.log('focus');
        $('#hr_msg').focus();
    })
    
    $('#hr_send').click(function(event){
        console.log('click: hr_send');
        $('#error_msg').empty();
        var msg = $('#hr_msg').val();
        var tocli = $('#hr_tocli').val();
        if(!(msg === "")){
            socket.emit('tocli_msg', {
                'msg': msg,
                'tocli': tocli
            });
            $('#hr_msg').val('');
            $('#hr_tocli').val('');
        }
        $header_message_view.css('display','none');
    });
    $('#hr_group_send').click(function(event){
        console.log('click: hr_send');
        $('#error_msg').empty();
        var msg = $('#hr_msg').val();
        var tocli = $('#hr_tocli').val();
        if(!(msg === "")){
            socket.emit('togroup_msg', {
                'msg': msg,
                'tocli': tocli
            });
            $('#hr_msg').val('');
            $('#hr_tocli').val('');
        }
        $header_message_view.css('display','none');
    });
    socket.on('fromcli_msg',function(data){ //이름 name, 사진 myphoto, 날짜 wday, 메세지 msg
        console.log('event: fromcli_msg');
        var list = '<li><a href="#"><span class="photo"><img alt="avatar" src="/uploads/profiles/'+
                        data.myphoto+'"><pre class="message">'+data.msg+'</pre></span><span class="subject"><span class="from">'+data.name+'</span><span class="time">'+
                        data.wday+'</span></span></a></li>';
        $('#hr_msglist').after(list);
        var count = $('#cnt_newmsg').text();
        if(!count){count = 1;}else{count = Number(count) + 1;}
        $('#cnt_newmsg').text(count);
    });
    socket.on('from_group_msg',function(data){ //이름 name, 사진 myphoto, 날짜 wday, 메세지 msg
        console.log('event: from_group_msg');
        var list = '<li style="background:rgba(252,255,119,0.61);"> &nbsp;Group Message<a href="#"><span class="photo"><img alt="avatar" src="/uploads/profiles/'+
                        data.myphoto+'"><pre class="message">'+data.msg+'</pre></span><span class="subject"><span class="from">'+data.name+'</span><span class="time">'+
                        data.wday+'</span></span></a></li>';
        $('#hr_msglist').after(list);
        var count = $('#cnt_newmsg').text();
        if(!count){count = 1;}else{count = Number(count) + 1;}
        $('#cnt_newmsg').text(count);
    });
        // $("#msgbox").keyup(function(event) {
            
        //     if (event.which == 13) {
        //         socket.emit('fromclient',{msg:$('#msgbox').val()});
        //         $('#msgbox').val('');
        //     }
        // });
        // socket.on('toclient',function(data){
        //     console.log(data.msg);
        //     $('#msgs').append(data.msg+'<BR>'+data.run+'<BR>');
        // });
        
        

});


/**
 * 시간 계산
 */ 

function getCalDate(qday){
    // console.log(qday);
    var qday2 = new Date(qday);
    var interval = new Date().getTime() - qday2.getTime();
    
    var o = Math.floor(interval / (1000*60*60*24));
    
    if(o > 0){
        // console.log(o + '일 전');
        return(o+'일 전');
    }else{
        if(interval > 3600000){
            o = Math.floor(interval / 3600000);
            // console.log(o + '시간 전');
            return(o+'시간 전');
        }else if(interval > 60000){
            o = Math.floor(interval / 60000);
            // console.log(o + '분 전..');
            return(o+'분 전..');
        }else if(interval > 1000){
            o = Math.floor(interval / 1000);
            // console.log(o + '초 전..');
            return(o+'초 전..');
        }else{
            // console.log('방금');
            return('방금');
        }    
    } 
}  
 