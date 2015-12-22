var express = require('express');
var passport = require('passport');
var router = express.Router();
var multer  = require('multer');
var mysql = require('../config/mysql');
var upload = multer({ dest: '../public/uploads/profiles' });

/* GET POST users listing. */

// show the login form
router.get('/login', function(req, res) {
	// render the page and pass in any flash data if it exists
	res.render('member/login', { 
        title: '육아가 가장 쉬웠어요 - 로그인',
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
		user : req.user, // get the user out of session and pass to template
	    message: req.flash('signupMessage'),
	    page: 'users' 
	});
});

// process the signup form
router.post('/signup', upload.single('myphoto'), passport.authenticate('local-signup', {
	successRedirect : '/users/profile', // redirect to the secure profile section
	failureRedirect : '/users/signup', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));

// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
router.get('/profile', isLoggedIn,function(req, res) {
    // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!sdfasdfasdfasdf'+req.user[0].id);
    // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!sdfasdfasdfasdf'+req.user);
    // console.log(req.user);
	res.render('member/profile', {
        title: '육아가 가장 쉬웠어요 - 회원 정보 ',
		user : req.user, // get the user out of session and pass to template
	    page: 'users' 
	});
});

router.get('/update',function(req, res) {
	res.render('member/updateSignup', {
        title: '육아가 가장 쉬웠어요 - 회원 정보 수정',
		user : req.user, // get the user out of session and pass to template
	    page: 'users' 
	});
});

router.post('/update', upload.single('myphoto'), function(req, res, next){
    var myphoto;
    if(req.file){
        myphoto = req.file.filename;
    }else{
        myphoto = req.user[0].myphoto;
    }
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!photo!!!!!!!!!!!!!!!!')
    console.log(myphoto);
	 var updateUserMysql = [{
                        'gender':req.body.gender,
                        'phone':req.body.phone,
                        'b_name':req.body.b_name,
                        'b_birth':req.body.b_birth,
                         'myphoto': myphoto
                    },{ 'id': req.user[0].id }];
                    console.log(updateUserMysql);
                    console.log(req.user[0].id);
                    console.log(req.user);
                    
    var query = mysql.connection.query('update member set ? where ?',updateUserMysql, function(err,result){
        if (err) {
            console.error(err);
            throw err;
        }
        console.log(query);
        req.user[0].gender = req.body.gender;
        req.user[0].phone = req.body.phone;
        req.user[0].b_name = req.body.b_name;
        req.user[0].b_birth = req.body.b_birth;
        req.user[0].myphoto = myphoto;
        
        res.redirect('/users/profile');

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