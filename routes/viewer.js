var express = require('express');
var mysql = require('../config/mysql');
var passport = require('passport');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'public/uploads/viewer' });

/* GET POST users listing. */
//담당 writer : 지혜
//뷰 path : views/viewer/
// 
router.get('/', function(req, res, next) { //localhost:8080/viewer/


    // mysql.connection.query('select * from viewer order by id desc limit 2', function(err, rows){
    mysql.connection.query('select * from skateboard where id order by num desc limit 30',{'id':req.user[0].id}, function(err, rows){
        if(err){
            console.log(err);
        }
        // res.json(rows);
        // console.log('rows.height:'+ rows.height);
        console.log(rows);
        console.log('rows.length:'+ rows.length);
        console.log('(30-rows.length):'+ (30-rows.length));
        // console.log('rows[0].height:'+ rows[0].height);
        // height = rows[0].height;
        // console.log('height:'+ height);
        var a = rows.length;
        if(a < 30){
            for(var x =0; x < (30-a); x++){
                rows.push({
                    height : 0,
                    weight : 0,
                    head : 0,
                    sleep : 0
                })
                console.log("loop")
                console.log(x)
                console.log(rows.length)
          }
        }

         // res.json(rows);
         res.render('viewer/viewer', { 
            title: '육아가 가장 쉬웠어요 - 성장뷰어',
    		user : req.user, // get the user out of session and pass to template
            page: 'viewer',
            aaaa: rows,
        });
    })
});

/*router.post('/',function(req, res, next){
    
    console.log("----------- POST: /viewer SQL insert------------");
    var user = {'height':req.body.height,
                'weight':req.body.weight,
                'head':req.body.head,
                'powder':req.body.powder,
                'milk':req.body.milk,
                'food':req.body.food,
                'sleep':req.body.sleep
                };
    var query = mysql.connection.query('insert into skateboard set ?',user,function(err,result){
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
});*/

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