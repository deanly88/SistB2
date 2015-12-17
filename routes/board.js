var express = require('express');
var mysql = require('../config/mysql');
var passport = require('passport');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: '../public/uploads/board' });
/*var angular=require('../public/angular/angular');
*/

/* GET POST users listing. */
//담당 writer : 경목
//뷰 path : views/board/
// 


router.get('/qna', function(req, res, next) {
    res.render('board/qna', { 
        title: '육아가 가장 쉬웠어요 - 커뮤니티 - Q & A ',
		user : req.user, // get the user out of session and pass to template
        page: 'community'
    });
});

router.get('/list/:boardId/:page', function(req, res, next) {  // local/board/1/50
    //TODO(dean): pageHandle - list, write, check(del), content
    //페이지 번
  console.log('req.baseUrl : '+req.baseUrl);
  console.log('req.path : '+req.path);
  console.log('req.params.boardId : '+req.params.boardId);
  console.log('req.params.contentId : '+req.params.contentId);
  console.log('req.route : '+req.route);
    res.render('board/board', { 
        title: '육아가 가장 쉬웠어요 - 커뮤니티 - 자유게시판',
		user : req.user, // get the user out of session and pass to template
        page: 'community'
    });
});



router.get('/content/:num', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('board/something', { 
        title: '육아가 가장 쉬웠어요 - ' 
	    
	});
});


router.get('/write', function(req, res, next) {
    res.render('board/write', { 
        title: '육아가 가장 쉬웠어요 - 커뮤니티 - ',
		user : req.user, // get the user out of session and pass to template
        page: 'community'
    });
});

router.post('/write',function(req, res, next){
    
    console.log("----------- POST: /test SQL insert------------");
    var user = {'b_id':req.body.b_id,
                'b_subject':req.body.b_subject,
    			'b_content':req.body.b_content,
    			'b_passwd':req.body.b_passwd,
    			'b_date':req.body.b_date
				};
    var query = mysql.connection.query('insert into board set ?',user,function(err,result){
        if (err) {
            console.error(err);
            throw err;
        }
        
        res.redirect('/board/notice');
    });
});


router.get('/notice', function(req, res, next) {
    
    mysql.connection.query('select * from board', function(err, rows){
    
        res.render('board/notice', { 
        title: '육아가 가장 쉬웠어요 - 커뮤니티 - 공지사항',
		user : req.user, // get the user out of session and pass to template
		list : rows,
        page: 'community'
    });
});

});

module.exports = router;
/*router.get('/board', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('/board', { 
        title: '육아가 가장 쉬웠어요 - ' 
	    
	});
});*/

/*router.get('/write', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('community/write', { 
        title: '육아가 가장 쉬웠어요 - ' 
	    
	});
});*/


/*
router.post('/writePro', function(req, res, next) {
    // 글쓰기에 관한 코드
    var num = 10; // 글쓰기한 게시글 넘버
    
    res.redirect('/content/'+num);
});*/


/*router.get('/notice', function(req, res, next) {
    
    angular.module('scopeExample', []).controller('MyController', ['$scope', function($scope) {
    
        mysql.connection.query('select * from board', function(err, rows){
    
        res.render('community/notice', { 
        title: '육아가 가장 쉬웠어요 - 커뮤니티 - 공지사항',
		user : req.user, // get the user out of session and pass to template
		rows :,
        page: 'community'
    });
});

}]);
});*/


