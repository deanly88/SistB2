
module.exports = function (server){
    var io = require('socket.io')(server);
    var mysql = require('../config/mysql');
    var connection = mysql.connection;
    var sessionMiddleware = require('../app').sessionMiddleware;
    
    console.log('socket start');
    var socket_ids = [];
    var count = 0;
    var run = 0;

    io.use(function(socket, next){
        sessionMiddleware(socket.request, socket.request.res, next);
        run ++;
        console.log(socket.session);
        console.log('~~~sessionMiddleware : '+run);
        next();
    });
   
    
    io.on('connection', function(socket){
        console.log('conn running:' +run);
        console.log('소켓리퀘스트');
        // console.log(socket.request.session);
        // 접속자 id를 확인하고 저장한다.
        console.log(socket.id);
        var myid = socket.id
        if(socket.request.session && socket.request.session.passport){
            if(socket.request.session.passport.user){
                console.log('페스포트 유저 있음')
                // if(pre_nick != undefined ) delete socket_ids[pre_nick];
                // socket_ids[nickname] = socket.id;
                // socket_ids[]
            }else{
                console.log('게스트 유저')
            }
        }
            
            
        // test event
        // socket.emit('test', 'Welcome Socket World hahaha\n소켓에 접속됨\n Socket ID : '+socket.id);
        // 접속자 카운팅 event
        socket.emit('conn_people',{
           msg: 'cmited...  conn_people',
           run: run
        });
        socket.broadcast.emit('conn_people',{
           msg: 'cmited...  conn_people',
           run: run
        });
        
        
        // 그룹에 속해있으면 join 하기.
        
    //     io.sockets.connected[socket.id].emit('toclient',{
    //         msg:'Welcome !'
    //   });
        socket.on('tocli_msg',function(data) {
            console.log('tocli_msg: ');
            console.log(data);
            //TODO(dean): fromclient도 조사해야함 socketid 테이블로 조사하기
            var q = { nick: data.tocli, username: data.tocli};
            connection.query("SELECT * FROM member WHERE nick = ? or username = ? ",[data.tocli, data.tocli], function(err, rows){
                console.log('query nick: ');
                console.log(rows);
                if(rows){
                    //TODO(dean): 오류 검사들
                    //TODO(dean): insert into message ...
                    //TODO(dean): 해당 받는 cli id가 접속중이면 메세지 보냄
                    // if(true){
                        console.log('emit');
                        io.sockets.connected[socket.id].emit('fromcli_msg',{
                            name: rows[0].nick,
                            myphoto: rows[0].myphoto,
                            wday: 'now',
                            msg: data.msg
                        });
                    // }
                }
            });
        });
    
        socket.on('fromclient',function(data){
            socket.broadcast.emit('toclient',{
                msg: data.msg,
                run: run
            }); // 자신을 제외하고 다른 클라이언트에게 보냄
            socket.emit('toclient',{
                msg: data.msg,
                run: run
            }); // 해당 클라이언트에게만 보냄. 다른 클라이언트에 보낼려면?
            console.log('Message from client :'+data.msg);
       });
        socket.on('disconnect', function(socket){
        console.log('#### disconnect');
        });
    //   socket.emit('disconnect')
    });
    return io;
}
