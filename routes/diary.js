var express = require('express');
var mysql = require('../config/mysql');
var passport = require('passport');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: '../public/uploads/diary' });

/* GET POST users listing. */
//담당 writer : 동연
//뷰 path : views/diary/
// 

router.get('/content/:num', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('diary/somthing', { 
        title: '육아가 가장 쉬웠어요 - ' 
	    
	});
});

router.get('/list', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('diary/somthing', { 
        title: '육아가 가장 쉬웠어요 - ' 
	    
	});
});

router.get('/', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('diary/something', { 
        title: '육아가 가장 쉬웠어요 - ' 
	    
	});
});

router.get('/write', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('diary/somthing', { 
        title: '육아가 가장 쉬웠어요 - ' 
	    
	});
});

router.post('/write', function(req, res, next) {
    // 글쓰기에 관한 코드
    var num = 10; // 글쓰기한 게시글 넘버
    
    res.redirect('/content/'+num);
});








module.exports = router;