var express = require('express');
var mysql = require('../config/mysql');
var passport = require('passport');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: '../public/uploads/board' });

/* GET POST users listing. */
//담당 writer : 경목
//뷰 path : views/board/
// 

/*
router.get('/notice', function(req, res, next) {
    
    res.redirect('/board/notice/1');

});


router.get('/notice/:contentId', function(req, res, next) {
var contentId =req.params.contentId;
contentId = parseInt(contentId,10);
var size = 10;
var begin = (contentId-1)*size;
    
    mysql.connection.query('select count(*) cnt from board ',[],function(err, rows){
    
        if(err)console.log('err',err);
        
        var cnt = rows[0].cnt;
        var totalPage =Math.ceil(cnt /size);
        var pageSize =10;
        var startPage= Math.floor((contentId-1)/pageSize)*pageSize+1;
        var endPage =startPage +(pageSize-1);
        
        if(endPage>totalPage){
            endPage=totalPage;
        }
        
        var max =cnt-((contentId-1)*size);
     mysql.connection.query('select b_num,b_id,b_subject,b_content,b_hits from board order by b_num desc limit ?,?',[begin,size],function(err, rows){
        
        if(err)console.log('err',err);
    
        res.render('board/notice', { 
        title: '육아가 가장 쉬웠어요 - 커뮤니티 - 공지사항',
		user : req.user, // get the user out of session and pass to template
		article : rows,
		contentId : contentId,
        pageSize : pageSize,
        startPage : startPage,
        endPage : endPage,
        totalPage : totalPage,
        max : max,
        page: 'community'
    });
});

});
});
*/
router.get('/', function(req, res, next) {
    res.redirect('/board/all');
});

router.get('/:boardId', function(req, res, next) {
    res.redirect('/board/'+req.params.boardId+'/1');
});

router.get('/:boardId/:pageNum', function(req, res, next) {
    console.log('~~~~~~boardId'+ req.params.boardId)
    // 변수선언
    var boardTitle;
    var boardId = req.params.boardId;
    var pageNum = req.params.pageNum;
    
    var pageSize = 30;
    var currentPage = pageNum;
    var startRow = (currentPage - 1) * pageSize + 1;
    var endRow = currentPage * pageSize
    
    
    // (분석) 게시판 이름
    switch(req.params.boardId){
        case 'notice':{
            boardTitle = '공지사항';
        }break;
        case 'qna':{
            boardTitle = '질문&답변';
        }break;
        case 'free':{
            boardTitle = '자유게시판';
        }break;
        default:{
            boardTitle = '전체게시판';
        }break;
    }
    // MySQL
    mysql.connection.query('select count(*) cnt from board', function(err, rows){
        if(err) {
            console.log(err);
            res.redirect('/');
        }
        var count = rows;
        var where;
        var sql;
        // (분석) 질의할 쿼리
        // Skill : SET @rownum:=0; SELECT @rownum:=@rownum+1 from board;
        var query;
        if(boardId === 'all'){
            where = '';
            boardId = '';  
            // sql = [{startRow,endRow}];
            sql = ''
            query = 'select *,(select nick from member where id = b.b_id) nick from board b';
            
        }else{
            where = ' where ? '; 
            // sql = [{b_boardId:boardId},startRow,endRow];
            sql = [{b_boardId:boardId}]
            query = 'select *,(select nick from member where id = b.b_id) nick \
                from board b where ?';
        }
        // var query = 'SET @rownum:=0; \
        //     SELECT * \
        //     FROM ( SELECT @rownum:=@rownum+1 rnum, a.* \
        //         FROM ( SELECT *, (SELECT nick FROM member WHERE id = b.b_id) nick \
        //             FROM board b '+where+
        //             'ORDER BY b_num) a \
        //     WHERE rnum BETWEEN ? AND ?';
        // var query = 'SET @rownum:=0; SELECT @rownum:=@rownum+1 AS rnum from board'
        // 데이터베이스 쿼리 실행
        mysql.connection.query(query,sql, function(err, rows){
            // 에러 핸들링 (에러 발생: '/'로 강제이동)
            if(err){
                console.log(err);
                res.redirect('/');
            }
            // 페이지 렌더링
            res.render('board/list', { 
                title: '육아가 가장 쉬웠어요 - 커뮤니티 - '+ boardTitle,
                boardTitle: boardTitle,
        		user : req.user, // get the user out of session and pass to template
        		lists : rows,
        		boardId : boardId,
        		pageNum: pageNum,
        		count: count,
                page: 'community',
                
            });
        });
    });
})
// 새로운 글쓰기 GET
router.get('/:boardId/write', function(req, res, next) {
    res.render('board/write', { 
        title: '육아가 가장 쉬웠어요 - 커뮤니티 - 글쓰기',
		user : req.user, // get the user out of session and pass to template
        page: 'community',
        boardId: req.params.boardId
    });
});
// 새로운 글쓰기 post
router.post('/:boardId/write',function(req, res, next){
    
    console.log("----------- POST: /test SQL insert------------");
    console.log(req.body);
    console.log(req.user);
    var user = {'b_id':req.user[0].id,
                'b_subject':req.body.b_subject,
    			'b_content':req.body.b_content,
    			'b_boardId':req.params.boardId,
    			'b_date':new Date()
				};
    var query = mysql.connection.query('insert into board set ?',user,function(err,result){
        if (err) {
            console.error(err);
            throw err;
        }
        
        res.redirect('/board/'+req.params.boardId);
    });
});

// 게시글 GET
router.get('/:boardId/content/:b_num', function(req,res,next) {
    
    var list = {
                  'b_num':req.params.b_num
                  
                  /*'b_hits':req.params.b_hits */
				};
        mysql.connection.query('update board set b_hits = b_hits+1 where ? ',list,function(err,result,next){
            if (err) {
                
                     console.error(err);
                     throw err;
                }
               
               /*  res.redirect('/board/content/:b_num');*/
        mysql.connection.query('select * from board where ?', list,function(err, rows){
            if (err) {
                console.error(err);
                throw err;
            }
            console.log(rows);
    	    res.render('board/content', { 
                title: '육아가 가장 쉬웠어요 - ',
                user : req.user, // get the user out of session and pass to template
                article : rows,
                page: 'community',
                b_num: req.params.b_num,
                boardId: req.params.boardId,
                pageNum : 1
             });
    	});

	});
});

//글삭제 GET
router.get('/:boardId/delete/:b_num', function(req, res, next) {
    mysql.connection.query('select b_id from board where ?',[{'b_num':req.params.b_num}],function(err, rows){
        if(err){
            console.log(err);
            next();
        }
        if(req.user && req.user[0].id == rows[0].b_id){
            mysql.connection.query('DELETE FROM board WHERE ?',[{'b_num':req.params.b_num}],function(err, result){
                if(err) console.log(err);
                res.redirect('/board/'+req.params.boardId);
            });
        }else{
            console.log('권한없음');
            req.flash('deleteMessage', '권한이 없습니다.');
            res.redirect('/board/'+req.params.boardId);
        }
    });
});


// 글수정 GET
router.get('/:boardId/update/:b_num', function(req, res, next) {
    
    
        res.render('board/update', { 
        title: '육아가 가장 쉬웠어요 - 커뮤니티 - 공지사항',
		user : req.user, // get the user out of session and pass to template
		b_num : req.params.b_num,
		boardId: req.params.boardId,
        page: 'community'
    });
});

// 글 수정 POST
router.post('/:boardId/update',function(req, res, next){
    
    console.log("----------- POST: /test SQL insert------------");
                
                var list = {
                                'b_num':req.params.b_num,
                                'b_id':req.user[0].id,
                                'b_subject':req.body.b_subject,
    			                'b_content':req.body.b_content,
    			                'b_boardId':req.params.boardId,
    			                'b_date':new Date()
				                }; 
  
 
			    mysql.connection.query('select b_id from board where ?',[{'b_num':req.params.b_num}],function(err,rows){
			          if(err){
                        console.log(err);
                        next();
                        }
			         
			     
			  if(req.user[0].id=== rows.b_id){
			             
                     mysql.connection.query('update board set ? ',list,function(err,result){
                         if (err) {
                               console.error(err);
                             throw err;
                         }
                
                                res.redirect('/board/'+req.params.boardId);
                    });
                    
			         } else{
			             
			                    req.flash('deleteMessage', '권한이 없습니다.');
                                 res.redirect('/board/'+req.params.boardId);
                            }
			             
			             
			       
        });


});

module.exports = router;








/*router.get('/list/:boardId/:page', function(req, res, next) {  // local/board/1/50
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
});*/










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


