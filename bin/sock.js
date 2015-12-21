
module.exports = function (server){
    var io = require('socket.io')(server);
    var mysql = require('../config/mysql');
    var connection = mysql.connection;
    console.log('socket start')
    var socket_ids = [];
    var count = 0;
    
    // function registerUser(socket,nickname){
    //     socket.get('nickname', function(err,pre_nick){
    //         if(pre_nick != undefined ) delete socket_ids[pre_nick];
    //         socket_ids[nickname] = socket.id;
    //         socket.
    //     })
    // }
    
    var run = 0;
    io.use(function(socket, next){
        // console.log(socket.request);
        console.log(socket.id);
        console.log('data binding');
        next();
    });
    
    io.on('connection', function(socket){
        console.log('run:' +run);
        run++;
        // test event
        // socket.emit('test', 'Welcome Socket World hahaha\n소켓에 접속됨\n Socket ID : '+socket.id);
        // 접속자 카운팅 event
        socket.emit('conn_people',{
           msg: 'cmited...  conn_people',
           run: run
        });
        
        
        // 그룹에 속해있으면 join 하기.
        
        socket.emit('')
    
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
       
    //   socket.emit('disconnect')
    });
}
