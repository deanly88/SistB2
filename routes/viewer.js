var express = require('express');
var mysql = require('../config/mysql');
var passport = require('passport');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: '../public/uploads/viewer' });

/* GET POST users listing. */
//담당 writer : 지혜
//뷰 path : views/viewer/
// 
router.get('/', function(req, res, next) {
    res.render('viewer', { 
        title: '육아가 가장 쉬웠어요 - 성장뷰어',
		user : req.user, // get the user out of session and pass to template
        page: 'viewer/viewer'
    });
});

router.get('/content/:num', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('viewer/somthing', { 
        title: '육아가 가장 쉬웠어요 - ' 
	    
	});
});

router.get('/list', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('viewer/somthing', { 
        title: '육아가 가장 쉬웠어요 - ' 
	    
	});
});

router.get('/write', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('viewer/somthing', { 
        title: '육아가 가장 쉬웠어요 - ' 
	    
	});
});

router.post('/write', function(req, res, next) {
    // 글쓰기에 관한 코드
    var num = 10; // 글쓰기한 게시글 넘버
    
    res.redirect('/content/'+num);
});








module.exports = router;