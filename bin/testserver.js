var express = require("express");
var Server = require("http").Server;
var session = require("express-session");
var RedisStore = require("connect-redis")(session);

var app = express();
var server = Server(app);
var sio = require("socket.io")(server);

var sessionMiddleware = session({
    store: new RedisStore({}), // XXX redis server config
    secret: "keyboard cat",
});

sio.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(sessionMiddleware);

app.get("/", function(req, res){
    req.session // Session object in a normal request
});

sio.sockets.on("connection", function(socket) {
  socket.request.session // Now it's available from Socket.IO sockets too! Win!
});


server.listen(process.env.PORT);