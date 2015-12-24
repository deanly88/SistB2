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

//TODO(dean): pageNum을 해야함. url 구조를 어떻게 해줄지 고민할 필요가 있음
//            현재 :  /board/:보드id/작업공간/:게시글번호
//            구상 :  /board/:보드id/작업공간/:페이지번호/:게시글번호
//              ex)   /board/:bardId/write/:pageNum
//              ex)   /board/:bardId/content/:pageNum/:b_num
//              ex)   /board/:bardId/delete/:pageNum/:b_num
//              ex)   /board/:bardId/update/:pageNum/:b_num
//              ex)   /board/:bardId/:pageNum

// ㅁ 발표시 write 페이지에 안들어가졌던 이유. 
// =>   url을 /board/:boardId/write 넘겨서 write페이지로 접속을 시도했지만 게시판 list만 떳다.
// =>   게시판 list의 경로가 /board/:boardId/:pageNum 으로 잡혀있었기 때문에
// =>   write라는 url 글자를 pageNum으로 해석하고 말았던것.
//      code 비교1 => router.get('/:boardId/write', function(req, res, next) {
//      code 비교2 => router.get('/:boardId/:pageNum', function(req, res, next) {
// =>   보시다시피 경로가 '/값/값'   으로 같은 꼴임.

// 해결 => 최상단에 있던 게시판 list의 경로를 판단하는 코드를 가장 아래로 이동시킴
//      => (게시판 list를 가장 마지막 순서에 라우팅 시킴)

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
    mysql.connection.query('select b_id from board where ?',[{'b_num':req.params.b_num}],function(err, rows){
        if(err){
            console.log(err);
            next();
        }
        if(req.user && req.user[0].id == rows[0].b_id){
            console.log('인증')
            mysql.connection.query('SELECT * FROM board WHERE ?',[{'b_num':req.params.b_num}],function(err, row){
                if(err){
                    console.log(err);
                    next();
                }
                
                res.render('board/write', { 
                    title: '육아가 가장 쉬웠어요 - 커뮤니티 - 공지사항',
            		user : req.user, // get the user out of session and pass to template
            		b_num : req.params.b_num,
            		boardId: req.params.boardId,
                    page: 'community',
                    article: row
                });
            });
        }else{
            console.log('권한없음');
            req.flash('deleteMessage', '권한이 없습니다.');
            res.redirect('/board/'+req.params.boardId);
        }
        
    });
    
});

// 글 수정 POST
router.post('/:boardId/update/:b_num',function(req, res, next){
    
    console.log("----------- POST: /test SQL update------------");
    var list = {
        'b_subject':req.body.b_subject,
        'b_content':req.body.b_content,
        'b_date':new Date()
    }; 
    mysql.connection.query('select b_id from board where ?',[{'b_num':req.params.b_num}],function(err,row){
        if(err){
            console.log(err);
            next();
        }
        if(req.user[0].id == row[0].b_id){
            console.log('인증');
            console.log(list);
            console.log(req.params.b_num);
            mysql.connection.query('update board set ? where ?',[list,{b_num: req.params.b_num}],function(err,result){
                if (err) {
                    console.error(err);
                    throw err;
                }
                
                res.redirect('/board/'+req.params.boardId+'/content/'+req.params.b_num);
            });
        
        } else{
            console.log('권한없음');
            req.flash('deleteMessage', '권한이 없습니다.');
            res.redirect('/board/'+req.params.boardId);
        }
    });
});

// 게시판 리스트 GET - 전체 게시판으로 리다이렉트
router.get('/', function(req, res, next) {
    res.redirect('/board/all');
});
// 게시판 리스트 GET - pageNum을 안써줄경우 자동으로 /1 리다이렉트
router.get('/:boardId', function(req, res, next) {
    res.redirect('/board/'+req.params.boardId+'/1');
});
// 게시판 리스트 GET
router.get('/:boardId/:pageNum', function(req, res, next) {
    console.log('~~~~~~boardId'+ req.params.boardId)
    console.log(req.params.boardId +'::'+ req.params.pageNum);
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
        		list : rows,
        		boardId : boardId,
        		pageNum: pageNum,
        		count: count,
                page: 'community',
                
            });
        });
    });
})

module.exports = router;