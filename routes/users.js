var express = require('express');
var mysql = require('../config/mysql');
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
var router = express.Router();

/* GET POST users listing. */

// router.post('/regist',function(req, res, next){
//     console.log("----------- POST: /regist SQL insert------------");
    
//     var user = {
//         'email':req.body.m_em,
//         'pw':req.body.m_p1,
//         'name':req.body.m_na,
//         'gender':req.body.m_gd,
//         'nick':req.body.m_nk,
//         'phone':req.body.m_pn,
//         'b_name':req.body.m_bn,
//         'b_birth':req.body.m_bh,
//         'accpt':req.body.m_ap
//     };
//     var query = mysql.connection.query('insert into member set ?',user,function(err,result){
//         if (err) {
//             console.error(err);
//             throw err;
//         }
//         console.log(query);
//         res.redirect('/users/login');
//     });
// });

// show the login form
router.get('/login', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('member/login', { 
        title: '육아가 가장 쉬웠어요 - 회원가입',
        message: req.flash('loginMessage') });
});

// process the login form
router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/users/profile', // redirect to the secure profile section
        failureRedirect : '/users/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
	}),
    function(req, res) {
        console.log("hello");

        if (req.body.remember) {
          req.session.cookie.maxAge = 1000 * 60 * 3;
        } else {
          req.session.cookie.expires = false;
        }
    res.redirect('/users/login');
});

// show the signup form
router.get('/signup', function(req, res) {
	// render the page and pass in any flash data if it exists
	res.render('member/signup', {
        title: '육아가 가장 쉬웠어요 - 회원가입',
	    message: req.flash('signupMessage') });
});

// process the signup form
router.post('/signup', passport.authenticate('local-signup', {
	successRedirect : '/users/profile', // redirect to the secure profile section
	failureRedirect : '/users/signup', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));

// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
router.get('/profile', isLoggedIn, function(req, res) {
	res.render('member/profile', {
        title: '육아가 가장 쉬웠어요 - 회원 정보',
		user : req.user // get the user out of session and pass to template
	});
});

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/users/login');
});

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/users/login');
}


router.get('/a', function(req, res, next) {
    console.log("-----------a------------");
    
    // res.render('index', { title: '육아가 가장 쉬웠어요' });
    next();
});

router.use(function(req,res,next){
    console.log("-----------use------------");
    next();
});

module.exports = router;