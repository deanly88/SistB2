var express = require('express');
var mysql = require('../config/mysql');
var router = express.Router();
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
/* GET POST users listing. */

/**
 * Passport 사용 테스트
 */

router.get('/', function(req, res) {
	res.render('test/login/index'); // load the index.ejs file
});

// show the login form
router.get('/login', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('test/login/login', { message: req.flash('loginMessage') });
});

// process the login form
router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/test/profile', // redirect to the secure profile section
        failureRedirect : '/test/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
	}),
    function(req, res) {
        console.log("hello");

        if (req.body.remember) {
          req.session.cookie.maxAge = 1000 * 60 * 3;
        } else {
          req.session.cookie.expires = false;
        }
    res.redirect('/test/login/');
});

// show the signup form
router.get('/signup', function(req, res) {
	// render the page and pass in any flash data if it exists
	res.render('test/login/signup', {  message: req.flash('signupMessage') });
});

// process the signup form
router.post('/signup', passport.authenticate('local-signup', {
	successRedirect : '/test/profile', // redirect to the secure profile section
	failureRedirect : '/test/signup', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));

// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
router.get('/profile', isLoggedIn, function(req, res) {
	res.render('test/login/profile', {
		user : req.user // get the user out of session and pass to template
	});
});

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/test/login');
});

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/test/login');
}

/**
 * MySQL 사용 테스트
 */ 
router.get('/sql', function(req, res, next) {
  console.log('req.baseUrl : '+req.baseUrl);
  console.log('req.path : '+req.path);
  console.log('req.params.test : '+req.params.test);
  console.log('req.route : '+req.route);
  res.render('test/input', { title: 'test' });
});

router.post('/sql',function(req, res, next){
    
    console.log("----------- POST: /test SQL insert------------");
    var user = {'userid':req.body.userid,
                'name':req.body.name,
                'address':req.body.address};
    var query = mysql.connection.query('insert into test set ?',user,function(err,result){
        if (err) {
            console.error(err);
            throw err;
        }
        console.log(query);
        res.redirect('/test/list');
    });
    // query = mysql.connection.query('select * from test',function(err,rows){
    //     if(err){
    //         console.error(err);
    //         throw err;
    //     }
    //     console.log(rows);
    //     res.json(rows);
    // });
    // console.log(query);
});
router.get('/list', function(req, res, next) {
    var query = mysql.connection.query('select * from test',function(err,rows){
        if(err){
            console.error(err);
            throw err;
        }
        console.log(rows);
        res.json(rows);
    });
    console.log(query);
});

/**
 * 채팅 Socket IO 테스트
 */
router.get('/chat', function(req, res, next) {
    res.render('test/chat');
});



module.exports = router;