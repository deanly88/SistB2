var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
// var passport = require('passport')
//     , LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var engine = require("ejs-locals");
// var mysql = require('./routes/mysql');
var passport = require('passport');
var flash    = require('connect-flash');
// var RedisStore = require("connect-redis")(session);

var sessionMiddleware = session({
    // store: new RedisStore({}), // XXX redis server config
	secret: 'goodteamworkplay',
	resave: false,
	saveUninitialized: true
 } );
 
// configuration ===============================================================
// connect to our database
require('./config/passport')(passport); // pass passport for configuration



var routes = require('./routes/index');
var users = require('./routes/users');
var board = require('./routes/board');
var diary = require('./routes/diary');
var schedular = require('./routes/schedular');
var viewer = require('./routes/viewer');
var test = require('./routes/test');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
// app.use(session({
//   key: 'sid',
//   secret: 'our team best',
//   cookie: {
//     maxAge: 1000*60*60
//   },
//   resave: false,
//   saveUninitialized: true
// }));

//TODO(dean): redis를 이용해서 session Store를 이용
app.use(sessionMiddleware); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', routes);
app.use('/users', users);
app.use('/board', board);
app.use('/diary', diary);
app.use('/schedular', schedular);
app.use('/viewer', viewer);
app.use('/test', test);

// global
// app.all('*',function(req, res, next){
//   console.log('global function')
//   if(req.user){
//     console.log(req.user);
//     // req.user += { test : 'test'}
//     // console.log(req.user);
//   }
//   next();
// })

// engine
app.engine('ejs', engine);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
module.exports.sessionMiddleware = sessionMiddleware;
