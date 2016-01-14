
module.exports = function (server){
    var io = require('socket.io')(server);
    var mysql = require('../config/mysql');
    var connection = mysql.connection;
    var sessionMiddleware = require('../app').sessionMiddleware;
    
    console.log('socket start');
    console.log(io.engine);
    var socket_ids = [];
    var pagingCounter = 0;
    var memberCounter = 0;
    var numUsers =0;
    
    io.use(function(socket, next){ // 미들웨어 페이지 리퀘스트마다 실행 
        sessionMiddleware(socket.request, socket.request.res, function(){
            pagingCounter ++;
            console.log('~~~sessionMiddleware : '+pagingCounter);
            console.log('소켓리퀘스트');

            // console.log(socket.request.session);
            // 접속자 id를 확인하고 저장한다.
            console.log(socket.id);
            var myid = socket.id;
            
            // 사용자 소켓 id 테이블 관리
            if(socket.request.session.passport){
                if(socket.request.session.passport.user){//로그인 한 유저
                    var user = socket.request.session.passport.user[0];
                    var userid = user.username;
                    console.log('회원 유저 : '+ user.id);
                    // console.log(user);
                    
                    //TODO(dean): 회원 방문자수 구현
                    if(socket_ids[userid] != myid){
                        socket_ids[userid] = myid;
                        
                        console.log('회원의 id를 테이블에 패치함: '+myid);
                        
                    }
                    console.log(socket_ids);
                    
                    //TODO(dean): DB를 읽어서 자신의 메세지 받기.
                    // gid 메세지랑 to_id 메세지
                    connection.query("select new,msg,wday,file,(select nick from member where id = m.from_id) nick, \
                    (select myphoto from member where id = m.from_id) myphoto \
                    from message m where to_id = ? or gid = (select groupid from member where id = ?)",
                    [user.id,user.id], function(err, rows){
                        if(err){
                            console.log(err);
                        }else{
                            for(var r = 0 ; r < rows.length; r++){
                                rows[r].date = getCalDate(rows[r].wday);
                            }
                            console.log(rows);
                            socket.emit('getMessages',{
                                'msgs':rows
                            });
                        }
                    });
                    
                    
                    
                    /**의문이 풀린 forEach 코드 실험
                     * 배열에서 숫자는 배열의 요소로 치고 key:value는 무시한다.
                        socket_ids.forEach(function(element, index, array){
                          console.log(element +': '+index+': '+array); 
                        })
                        var array = [1,2,3,4,5];
                        array['abd']='abdc';
                        array.forEach(function(element, index, array) {
                          console.log(element +': '+index+': '+array); 
                        })
                        console.log(array);
                        console.log(array.length);
                     */
                }else{
                    console.log('게스트 유저');
                }
            }
            next();
        });
    });
    io.use(function(socket, next){
        memberCounter = 0;
        for(var prop in socket_ids){
            if(socket_ids.hasOwnProperty(prop)){
                ++memberCounter;
            }
        }
        next();
    })
    
    io.on('connection', function(socket){ // 새로운 소켓 접속시 실행. 거의 모든 페이지 리퀘스트시 실행
        console.log('connection running:' +pagingCounter);
        // 그룹에 속해있으면 join 하기.
        
    //     io.sockets.connected[socket.id].emit('toclient',{
    //         msg:'Welcome !'
    //   });
        socket.on('readedAll',function(data){
            var q = [{'new':false},{'to_id':socket.request.session.passport.user[0].id}];
            // console.log(q);
            connection.query("UPDATE message SET ? WHERE ?",q,function(err, result){
                if(err){
                    console.log(err);
                }
            });
        });
        socket.on('tocli_msg',function(data) {
            console.log('tocli_msg: ');
            console.log(data);
            //TODO(dean): fromclient도 조사해야함 socketid 테이블로 조사하기
            connection.query("SELECT id, username, myphoto FROM member WHERE nick = ? or username = ? ",[data.tocli, data.tocli], function(err, rows){
                console.log('query nick: ');
                console.log(rows);
                if(err){
                    console.log(err);
                }else{
                    if(rows[0]){
                        //TODO(dean): 오류 검사들
                        //TODO(dean): insert into message ...
                        var msg = {
                            'from_id':socket.request.session.passport.user[0].id,
                            'to_id':rows[0].id,
                            'msg':data.msg,
                            'wday':new Date().toISOString().
                                          replace(/T/, ' ').      // replace T with a space
                                          replace(/\..+/, ''),     // delete the dot and everything after,
                            'new':true
                        }
                        console.log(msg);
                        connection.query("INSERT INTO message SET ?",msg,function(err, result){
                            if(err){
                                console.log(err);
                            }else{
                                
                                //TODO(dean): 해당 받는 cli id가 접속중이면 메세지 보냄
                                if(socket_ids[rows[0].username] != undefined){
                                    io.sockets.connected[socket_ids[rows[0].username]].emit('fromcli_msg',{
                                        name: socket.request.session.passport.user[0].nick,
                                        myphoto: socket.request.session.passport.user[0].myphoto,
                                        wday: '방금',
                                        msg: data.msg
                                    });
                                }
                                
                                // 내가 쓴글 보기
                                console.log('emit');
                                io.sockets.connected[socket.id].emit('fromcli_msg',{
                                    name: '내가 보낸 글',
                                    myphoto: rows[0].myphoto,
                                    wday: '방금',
                                    msg: data.msg
                                });
                            }
                        });
                    }else{
                        io.sockets.connected[socket.id].emit('error_msg',{
                            error_msg: '없는 회원 입니다.'
                        }); // 특정 클라이언트에게 보냄.  
                    }
                }
            });
        });
        
        socket.on('fromclient',function(data){
            socket.broadcast.emit('toclient',{
                msg: data.msg,
                run: pagingCounter
            }); // 자신을 제외하고 다른 클라이언트에게 보냄
            socket.emit('toclient',{
                msg: data.msg,
                run: pagingCounter
            }); // 해당 클라이언트에게만 보냄. 
            console.log('Message from client :'+data.msg);
        });
        
        console.log('memberCounter: '+memberCounter);
        console.log('접속중: '+io.engine.clientsCount);
        // 접속자 정보 방송
        socket.emit('conn_people',{
            conns: io.engine.clientsCount,
            paging: pagingCounter,
            members: memberCounter
        });
        socket.broadcast.emit('conn_people',{
            conns: io.engine.clientsCount,
            paging: pagingCounter,
            members: memberCounter
        });
        
        socket.on('disconnect', function(){
            console.log('~~~~~~~~~ disconnect');
            console.log(socket.id);
            if(socket.request.session.passport){
                if(socket.request.session.passport.user){
                    var user = socket.request.session.passport.user[0];
                    if(socket_ids[user.username]) {
                        delete socket_ids[user.username];
                        console.log('테이블에서 id 삭제');
                        // memberCounter--;
                    }
                }
            }
            console.log(socket_ids);
            if (addedUser) {
              --numUsers;
            
              // 회원 떠남
              socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
              });
            }
        });
        
/**
 *  채팅
 */
        var addedUser = false;

        // new message
        socket.on('new message', function (data) {
            // we tell the client to execute 'new message'
            socket.broadcast.emit('new message', {
              username: socket.username,
              message: data
            });
        });
        
        // add user
        socket.on('add user', function (username) {
            if (addedUser) return;
            
            // 사용자 이름 저장
            socket.username = username;
            ++numUsers;
            addedUser = true;
            socket.emit('login', {
              numUsers: numUsers
            });
            // 사용자 접속 방송
            socket.broadcast.emit('user joined', {
                  username: socket.username,
                  numUsers: numUsers
            });
        });
        socket.on('con_chat', function(){
            socket.emit('res_chat', {numUsers:numUsers});
        });
        // 글쓰기 중 방송
        socket.on('typing', function () {
            socket.broadcast.emit('typing', {
              username: socket.username
            });
        });
        
        // 글쓰기 중단 방송
        socket.on('stop typing', function () {
            socket.broadcast.emit('stop typing', {
              username: socket.username
            });
        });
        
/**
 * 그룹 맺기 기능 
 * Dean - 2016.01.13 15:31 
 *      emit위치 public/js/nam/nam_member.js
 */ 
 
 //Memo(dean): socket.request.session.passport.user[0].id
 
        //4 그룹 맺기 요청 수락
        socket.on('group_join_accept', function(data) {
            //dbms table mreq, table mgroup
            // var q = {};
            // connection.query("",q,function(err, result){
            //     if(err){
            //         console.log(err);
            //     }else{
            //     }
            // });
        });
        
        //4 그룹 맺기 요청 거절
        socket.on('group_join_reject', function(data) {
            //dbms table mreq
            // var q = {};
            // connection.query("",q,function(err, result){
            //     if(err){
            //         console.log(err);
            //     }
            // });
        });
        
        //1 그룹 맺기 요청 send
        socket.on('group_join_send', function(data) {
            // me, you id들
            console.log(data.receiver);
            var sender = socket.request.session.passport.user[0].id;
            console.log(sender);
            
            connection.query("SELECT id, groupid, username, (SELECT send_id FROM group_res WHERE send_id = ?) mysending  \
            FROM member WHERE nick = ? or username = ? ",[sender, data.receiver, data.receiver], function(err, rows){
                if(err){
                    console.log(err);
                    socket.emit('error_msg',{
                        error_msg: '알수 없는 오류'
                    });       
                }else{
                    console.log(rows);
                    if(!rows[0].id){ // **************************** 리시버가 없음
                        socket.emit('error_msg',{
                            error_msg: '없는 회원 입니다.'
                        }); // 특정 클라이언트에게 보냄.  
                    }else if(rows[0].id && rows[0].mysending){ // ** 요청한 적있음.
                        var qdata = {
                            'receive_id':rows[0].id,
                            'group_id':rows[0].groupid,
                            'res_day':new Date()
                                        //   .toISOString().
                                        //   replace(/T/, ' ').      // replace T with a space
                                        //   replace(/\..+/, '')     // delete the dot and everything after,
                        }
                        console.log(qdata);
                        connection.query("UPDATE group_res SET ? WHERE ?",[qdata,{'send_id':sender}], function(err){
                            if(err){
                                console.log(err);
                                socket.emit('error_msg',{
                                    error_msg: '알수 없는 오류'
                                });
                            }
                            if(socket_ids[rows[0].username]){
                                io.sockets.connected[socket_ids[rows[0].username]].emit('group_join_receive',{
                                    'sender':sender
                                });
                            }
                            
                            socket.emit('error_msg',{
                                error_msg: rows[0].username+'님께 요청을 보냈습니다.'
                            }); // 특정 클라이언트에게 보냄.  
                        });
                        
                    }else{ // ************************************** 요청한적 없고 리시버가 존재.
                        var qdata = {
                            'send_id':sender,
                            'receive_id':rows[0].id,
                            'group_id':rows[0].groupid,
                            'res_day':new Date()
                                        //   .toISOString().
                                        //   replace(/T/, ' ').      // replace T with a space
                                        //   replace(/\..+/, '')     // delete the dot and everything after,
                        }
                        console.log(qdata);
                        connection.query("INSERT INTO group_res SET ? ",qdata, function(err){
                            if(err){
                                console.log(err);
                                socket.emit('error_msg',{
                                    error_msg: '알수 없는 오류'
                                });
                            }
                            io.sockets.connected[socket_ids[rows[0].username]].emit('group_join_receive',{
                                'sender':sender
                            });
                            
                            socket.emit('error_msg',{
                                error_msg: rows[0].username+'님께 요청을 보냈습니다.'
                            }); // 특정 클라이언트에게 보냄.  
                        });
                    }
                }
                
            });
            
            //2 그룹 맺기 요청 receive
            
            // io.sockets.connected[socket.id].emit('group_join_receive',{
            //     error_msg: '없는 회원 입니다.'
            // }); // 특정 클라이언트에게 보냄.  
            
            // socket.emit('group_join_receive',{
            //     // 보낸애랑 받는애 id
                
            // });
            
        });
        
        // 그룹 탈퇴
        socket.on('group_join_leave', function(data) {
            //if 그룹에 인원이 2명 이하면 그룹 해체
            
        })
        
        
    });// event connection
}


/**
 * 시간 계산
 */ 
function getCalDate(qday){
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