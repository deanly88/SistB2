/**
 *  멤버 관련된 소켓들 - 작성자 이남영
 * 
 */ 


$(function(){
    // var socket = io.connect('https://sistb2-deanly88.c9users.io:8080');
    
    /**
     * 그룹 기능
     */
    var test_string = '2,4,5,2,3';
    var test_cnt = 5;
    
    //분리하기
    var test_ids = test_string.split(',');
    console.log(test_ids);
    console.log(test_ids.length);
    
    //합치기
    test_ids.concat()
    console.log(test_ids);
    var test_join;
    test_join = test_ids.join(',');
    console.log(test_join);
    
    
    // 그룹 추가 ** 
    
    // 그룹 삭제 ** 
    
    // 그룹 멤버 추가
    
    // 그룹 멤버 삭제
    
    
    
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
        data.msgs.forEach(function(element){
            // console.log(element)
            var wday = getCalDate(element.wday);
            var list = '<li><a href="#"><span class="photo"><img alt="avatar" src="/uploads/profiles/'+
                        element.myphoto+'"><pre class="message">'+element.msg+'</pre></span><span class="subject"><span class="from">'+element.nick+'</span><span class="time">'+
                        element.date+'</span></span></a></li>';
            $('#hr_msglist').after(list);
            var count = $('#cnt_newmsg').text();
            if(element.new){count = Number(count) + 1;}
            $('#cnt_newmsg').text(count);
        })
    });
    socket.on('conn_people',function(data){
        $('#pagingCnt').empty();
        $('#pagingCnt').append(data.paging);
        $('#connectCnt').empty();
        $('#connectCnt').append(data.conns);
        $('#memberCnt').empty();
        $('#memberCnt').append(data.members);
    });
    $('#hr_icon_msg').click(function(event){
        $('#cnt_newmsg').empty();
        socket.emit('readedAll');
    });
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
        
        $('#hr_msg').focus();
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
    console.log(qday);
    var qday2 = new Date(qday);
    var interval = new Date().getTime() - qday2.getTime();
    
    var o = Math.floor(interval / (1000*60*60*24));
    
    if(o > 0){
        console.log(o + '일 전');
        return(o+'일 전');
    }else{
        if(interval > 3600000){
            o = Math.floor(interval / 3600000);
            console.log(o + '시간 전');
            return(o+'시간 전');
        }else if(interval > 60000){
            o = Math.floor(interval / 60000);
            console.log(o + '분 전..');
            return(o+'분 전..');
        }else if(interval > 1000){
            o = Math.floor(interval / 1000);
            console.log(o + '초 전..');
            return(o+'초 전..');
        }else{
            console.log('방금');
            return('방금');
        }    
    } 
}  
 