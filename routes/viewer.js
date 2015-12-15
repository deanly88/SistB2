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
router.get('/viewer', function(req, res, next) {//localhost:8080/viewer/
 var height
    mysql.connection.query('select * from viewer order by id desc limit 2', function(err, rows){
        if(err){
            
        }
        // res.json(rows);
        // console.log('rows.height:'+ rows.height);
        console.log('rows.length:'+ rows.length);
        console.log('(10-rows.length):'+ (10-rows.length));
        // console.log('rows[0].height:'+ rows[0].height);
        // height = rows[0].height;
        // console.log('height:'+ height);
        var a = rows.length;
        if(a < 10){
            for(var x =0; x < (10-a); x++){
                rows.push({
                    height: 0
                })
                console.log("loop")
                console.log(x)
                console.log(rows.length)
                
            }
        }
        // res.json(rows);
         res.render('viewer', { 
            title: '육아가 가장 쉬웠어요 - 성장뷰어',
    		user : req.user, // get the user out of session and pass to template
            page: 'viewer',
            height1: height,
            num:1,
            aaaa: rows
        });
    })
});

router.post('/viewer',function(req, res, next){
    
    console.log("----------- POST: /viewer SQL insert------------");
    var user = {'height':req.body.height,
                'weight':req.body.weight,
                'head':req.body.head};
    var query = mysql.connection.query('insert into viewer set ?',user,function(err,result){
        if (err) {
            console.error(err);
            throw err;
        }
        console.log(query);
        res.redirect('/viewer');
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