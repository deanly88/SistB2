
module.exports = function (server){
    var io = require('socket.io')(server);
    var mysql = require('../config/mysql');
    var connection = mysql.connection;
    var sessionMiddleware = require('../app').sessionMiddleware;
    var groupio = require('../bin/group_io');
    
    console.log('socket start');
    // console.log(io.engine);
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
                    
                    //TODO(dean): 시간날때 모두 함수로 빼서 콜백으로 넣기.
                    
                    
                    connection.query("select new,msg,wday,file,(select nick from member where id = m.from_id) nick, \
                    (select myphoto from member where id = m.from_id) myphoto, gid \
                    from message m where to_id = ? or gid = (select groupid from member where id = ?)",
                    [user.id,user.id], function(err, msgs){
                        if(err){
                            console.log(err);
                            return;
                        }
                        for(var r = 0 ; r < msgs.length; r++){
                            msgs[r].date = getCalDate(msgs[r].wday);
                        }
                        // console.log(msgs);
                        socket.emit('getMessages',{
                            'msgs':msgs,
                            'gmems':''
                        });
                        connection.query("SELECT send_id, res_day, (SELECT nick FROM member WHERE id = send_id) nick \
                        FROM group_res WHERE receive_id = ?",[user.id],function(err, rows) {
                            if(err){
                                console.log(err);
                                return;
                            }
                            if(rows[0]){
                                socket.emit('group_join_receive', {
                                    'sender': rows[0].nick,
                                    'date': getCalDate(rows[0].res_day)
                                });
                            }
                            emitGroupInfo(user.username);
                        })
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
    
        socket.on('con_home',function(data) {
             connection.query('SELECT sdays, edays, number, thing FROM dday limit 6',function(err, info) {
                 if(err){
                     console.log(err);
                     return;
                 }
                 console.log(info);
                 socket.emit('res_home',{
                     'info':info
                 });
             })
        });
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
        socket.on('togroup_msg',function(data) {
            var id = socket.request.session.passport.user[0].id;
            connection.query("SELECT groupid, myphoto, nick FROM member WHERE ? ",
            [{'id':id}], function(err, rows){
                if(err){
                    console.log(err);
                    return;
                }
                if(rows[0].groupid){
                    var msg = {
                        'from_id':id,
                        'gid':rows[0].groupid,
                        'msg':data.msg,
                        'wday':new Date().toISOString().
                                      replace(/T/, ' ').      // replace T with a space
                                      replace(/\..+/, ''),     // delete the dot and everything after,
                        'new':false
                    }
                    console.log(msg);
                    connection.query("INSERT INTO message SET ?",msg,function(err, result){
                        if(err){
                            console.log(err);
                        }else{
                            
                            // 내가 쓴글 보기
                            connection.query("SELECT username FROM member WHERE ?",
                            [{'groupid':rows[0].groupid}],function(err, rows2){
                                if(err){
                                    console.log(err);
                                    return;
                                }
                                console.log(rows2);
                                // TODO(dean): 해당 받는 cli id가 접속중이면 메세지 보냄
                                rows2.forEach(function(row){
                                    if(socket_ids[row.username]){
                                        console.log(row.username);
                                        io.sockets.connected[socket_ids[row.username]].emit('from_group_msg',{
                                            name: socket.request.session.passport.user[0].nick,
                                            myphoto: socket.request.session.passport.user[0].myphoto,
                                            wday: '방금',
                                            msg: data.msg
                                        });
                                    }
                                })
                            });
                        }
                    });
                }else{
                    socket.emit('error_msg',{
                        error_msg: '그룹에 속하지 않습니다.'
                    }); 
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
 *  채팅 - socket.io Chat 데모 코드
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

        //1 그룹 맺기 요청 send
        socket.on('group_join_send', function(data) {
            // me, you id들
            // console.log(data.receiver);
            var sender = socket.request.session.passport.user[0].id;
            var sendernick = socket.request.session.passport.user[0].nick;
            // console.log(sender);
            
            connection.query("SELECT id, groupid, username, nick, (SELECT send_id FROM group_res WHERE send_id = ?) mysending  \
            FROM member WHERE nick = ? or username = ? ",[sender, data.receiver, data.receiver], function(err, rows){
                if(err){
                    console.log(err);
                    socket.emit('error_msg',{
                        error_msg: '알수 없는 오류'
                    });       
                }else{
                    // console.log(rows);
                    if(!rows[0].id){ // **************************** 리시버가 없음
                        socket.emit('error_msg',{
                            error_msg: '없는 회원 입니다.'
                        }); // 특정 클라이언트에게 보냄.  
                    }else if(rows[0].id && rows[0].mysending){ // ** 요청한 적있음.
                        var qdata = {
                            'receive_id':rows[0].id,
                            'group_id':rows[0].groupid,
                            'res_day':new Date().toISOString().
                                          replace(/T/, ' ').      // replace T with a space
                                          replace(/\..+/, '')     // delete the dot and everything after,
                        }
                        // console.log(qdata);
                        connection.query("UPDATE group_res SET ? WHERE ?",[qdata,{'send_id':sender}], function(err){
                            if(err){
                                console.log(err);
                                socket.emit('error_msg',{
                                    error_msg: '알수 없는 오류'
                                });
                            }
                            if(socket_ids[rows[0].username]){
                                io.sockets.connected[socket_ids[rows[0].username]].emit('group_join_receive',{
                                    'sender':sendernick,
                                    'date':'방금'
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
                            'res_day':new Date().toISOString().
                                          replace(/T/, ' ').      // replace T with a space
                                          replace(/\..+/, '')     // delete the dot and everything after,
                        }
                        // console.log(qdata);
                        connection.query("INSERT INTO group_res SET ? ",qdata, function(err){
                            if(err){
                                console.log(err);
                                socket.emit('error_msg',{
                                    error_msg: '알수 없는 오류'
                                });
                            }
                            //2 그룹 맺기 요청 receive
                            if(socket_ids[rows[0].username]){
                                io.sockets.connected[socket_ids[rows[0].username]].emit('group_join_receive',{
                                    'sender':sendernick,
                                    'date':'방금'
                                });
                            }
                            
                            socket.emit('error_msg',{
                                error_msg: rows[0].username+'님께 요청을 보냈습니다.'
                            }); // 특정 클라이언트에게 보냄.  
                        });
                    }
                }
                
            });
            
        });
            
        // 그룹 요청 수락
        socket.on('group_join_accept',function(data) {
            // DB 할일 3가지 1)update member.groupid   2)insert into mgroup.id   3)delete group_res.send_id

// TODO(dean):.. 시간날때 .. 함수 쪼개자..

            var mynick = socket.request.session.passport.user[0].nick;
            var onick = data.sender;
            console.log(mynick+':'+onick);
            connection.query("SELECT id, groupid FROM member WHERE ? or ?",[{'nick':mynick},{'nick':onick}], function(err, rows){
                if(err){
                    console.log(err);
                }
                console.log(rows);
                if(!rows[1] || !rows[0]) return;
                if(rows[0].groupid && rows[1].groupid ){
                    // 둘다 그룹 있음  에러 출력.
                    console.log('둘다 그룹 있음');
                    socket.emit('error_msg',{
                        error_msg:'상대도 그룹이 있어서 탈퇴해야 합니다.'
                    });
                    return;
                }else if(rows[0].groupid || rows[1].groupid ){
                    // 둘중 한명이 그룹 있음  
                    console.log('한명만 그룹 있음');
                    var groupid = rows[0].groupid?rows[0].groupid:rows[1].groupid;
                    console.log('groupid: '+groupid);
                    
                    connection.query("SELECT * FROM mgroup WHERE ? ",
                    [{'id':groupid}], 
                    function(err, rows2){
                        if(err){
                            console.log(err);
                            return;
                        }
                        // 멤버 배열 얻기
                        var members = rows.reduce(function(a,b){
                            return groupio.addMember(a,b.id);
                        },groupio.getArray(rows2[0].mem_ids));
                        
                        console.log('1');
                        var queries = "UPDATE member SET groupid = "+groupid+" WHERE id = "+
                        rows[0].id+"; UPDATE member SET groupid = "+groupid+" WHERE id = "+
                        rows[1].id+";";
                        connection.query(queries,
                        function(err, info){
                            if(err){
                                console.log(err);
                                return;
                            }
                            console.log('2');
                            connection.query("UPDATE mgroup SET ? WHERE ?",
                            [{'count':members.length,'mem_ids':members.join(',')},
                            {'id':groupid}], 
                            function(err, info){
                                if(err){
                                    console.log(err);
                                    return;
                                }
                                console.log('3');
                                connection.query("DELETE FROM group_res WHERE ? or ?",
                                [{'send_id':rows[0].id},{'send_id':rows[1].id}], 
                                function(err, info){
                                    if(err){
                                        console.log(err);
                                        return;
                                    }
                                    console.log('ok');
                                });
                            });
                        });
                    });
                    
                }else{
                    // 둘다 그룹 없음 새로 생성하는 그룹
                    console.log('둘다 그룹 없음');
                    var members = rows.reduce(function(a,b){
                        return groupio.addMember(a,b.id);
                    },[]);
                    // var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                    console.log(members);
                    connection.query("INSERT INTO mgroup SET ? ",
                    [{'count':members.length,'mem_ids':members.join(',')}], 
                    function(err, info){
                        if(err){
                            console.log(err);
                            return;
                        }        
                        console.log('1')
                        var queries = "UPDATE member SET groupid = "+info.insertId+" WHERE id = "+
                        members[0]+"; UPDATE member SET groupid = "+info.insertId+" WHERE id = "+
                        members[1]+";";
                        connection.query(queries,
                        function(err, info){
                            if(err){
                                console.log(err);
                                return;
                            }
                            console.log('2')
                            connection.query("DELETE FROM group_res WHERE ? or ?",
                            [{'send_id':members[0]},{'send_id':members[1]}], 
                            function(err, info){
                                if(err){
                                    console.log(err);
                                    return;
                                }
                                console.log('ok')
                                
                            });
                        });
                    });
                }
                // 새맴버의 참여를 공지 
                console.log('새맴버 참여 공지');
                socket.emit('refresh');
                socket.broadcast.emit('refresh');
                
                
            });
            
        });
        
        // 그룹 요청 거절
        socket.on('group_join_reject',function(data) {
            // DB 1) DELETE group_res.send_id 
            connection.query("SELECT id, groupid FROM member WHERE ?",
            [{'nick':data.sender}], function(err, rows){
                if(err){
                    console.log(err);
                    return;
                }
                connection.query("DELETE FROM group_res WHERE send_id = ? ",
                [rows[0].id], function(err, rows2) {
                    if(err){
                        console.log(err);
                        return;
                    }
                    
                });
            });
        });
        
        // 그룹 탈퇴
        socket.on('group_join_leave', function(data) {
            // DB 1) UPDATE member.groupid  2) UPDATE mgroup.id
            //if 그룹에 인원이 2명 이하면 그룹 해체 3) DELETE mgroup.id
            var id = socket.request.session.passport.user[0].id;
            connection.query("SELECT id, groupid FROM member WHERE ? ",
            [{'id':id}], function(err, rows1){
                if(err){
                    console.log(err);
                    return;
                }
                var groupid = rows1[0].groupid;
                connection.query("SELECT * FROM mgroup WHERE ?",
                [{'id':groupid}], function(err, rows2){
                    if(err){
                        console.log(err);
                        return;
                    }
                    var members = groupio.subMember(groupio.getArray(rows2[0].mem_ids), id);
                    connection.query('UPDATE member SET groupid = null WHERE id = ?',
                    [id], function(err, info) {
                        if(err){
                            console.log(err);
                            return;
                        }
                        connection.query("UPDATE mgroup SET ? WHERE ?",
                        [{'count':members.length,'mem_ids':members.join(',')},
                        {'id':groupid}], 
                        function(err, info){
                            if(err){
                                console.log(err);
                                return;
                            }
                            console.log('ok');
                            socket.emit('refresh');
                            socket.broadcast.emit('refresh');
                        });
                    });
                });
            });
            
            
        });
        
        socket.on('refresh',function(data) {
            console.log('refresh'+socket.request.session.passport.user[0].username)
            emitGroupInfo(socket.request.session.passport.user[0].username);
        })
        
    });// event connection
    
    
    function emitGroupInfo(username){
        // 그룹 사람들의 im nick file state
        connection.query('SELECT groupid FROM member WHERE username = ?',[username],
        function(err, rows) {
            if(err){
                console.log(err);
                return;
            }
            var groupid = rows[0].groupid;
            if(groupid){
                console.log(username+":"+groupid);
                connection.query('SELECT username, nick, myphoto FROM member WHERE groupid = ?',
                [groupid],function(err, rows){
                    if(err){
                        console.log(err);
                        return;
                    }
                    console.log(rows);
                    for(var r = 0 ; r < rows.length; r++){
                        if(socket_ids[rows[r].username])
                            rows[r].state = 'on';
                        else
                            rows[r].state = 'off';
                    }
                    io.sockets.connected[socket_ids[username]].emit('group_info_list',{
                        'im':true,
                        'info':rows
                    });
                })
            //     connection.query('SELECT * FROM mgroup WHERE id = ?',[groupid],
            //     function(err, rows2) {
            //         if(err){
            //             console.log(err);
            //             return;
            //         }
            //         var members = rows2[0].mem_ids.split(',');
            //         console.log(members);
            //         connection.query('SELECT nick, myphoto FROM member WHERE id = ?',
            //         [rows2[0].mem_ids],function(err, rows3){
            //             if(err){
            //                 console.log(err);
            //                 return;
            //             }
            //             console.log(rows3);
            //             io.sockets.connected[socket_ids[username]].emit('group_info_list',{
            //                 'im':true,
            //                 'info':rows3
            //             });
            //         })
            //     })
                
                
            }else{
                io.sockets.connected[socket_ids[username]].emit('group_info_list',{
                  'im':false 
                });
            }
            
        })
    }
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