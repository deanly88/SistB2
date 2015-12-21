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
/*router.get('/', function(req, res, next) { // GET : localhost:8080/diary
    res.render('diary/list', { 
        title: '육아가 가장 쉬웠어요 - 맘스 다이어리',
        user : req.user, // get the user out of session and pass to template
        page: 'list'
    });
});*/

router.get('/writeForm', function(req, res, next) { // GET : localhost:8080/diary/write

	// render the page and pass in any flash data if it exists
	res.render('diary/writeForm', { 
        title: '육아가 가장 쉬웠어요 - ',
        user : req.user, // get the user out of session and pass to template
        page: 'diary'
	    
	});
});

router.post('/update', upload.single('myphoto'), function(req, res, next){
    var myphoto;
    if(req.file){
        myphoto = req.file.filename;
    }else{
        myphoto = req.user[0].myphoto;
    }
   
	 var updateUserMysql = {
                      
                        'myphoto': myphoto
                    };
                    
    var query = mysql.connection.query('update member set ? where ?',updateUserMysql, function(err,result){
        if (err) {
            console.error(err);
            throw err;
        }
        

        req.user[0].myphoto = myphoto;
        
        res.redirect('/users/profile');

    });
});


router.post('/writeForm', upload.single('imageAdd'), function(req, res, next){
//console.log(req);
 var imageAdd;
    if(req.file){
        imageAdd = req.file.filename;
    }else{
        imageAdd = req.user[0].imageAdd;
    }

    var user = {
                'title':req.body.title,
    			'content':req.body.content,
    			'id':req.user[0].id,
    			'height':req.body.height,
                'weight':req.body.weight,
    		    'head':req.body.head,
    		    'powder':req.body.powder,
    		    'milk':req.body.milk,
    		    'food':req.body.food,
    		    'sleep':req.body.sleep,
    		    'imageAdd':imageAdd,
    		    'date':new Date()
				};
    var query = mysql.connection.query('insert into skateboard set ?',user,function(err,result){
        if (err) {
            console.error(err);
            throw err;
        }
        //console.log(query);
        req.user[0].imageAdd = req.body.imageAdd;
        res.redirect('/diary/list');
    });
    
    
});

router.get('/list', function(req, res, next) { // POST : localhost:8080/diary/write

 mysql.connection.query('select * from skateboard where ? order by num desc',{'id':req.user[0].id}, function(err, rows){
    if(err){
        console.log(err);
    }
   //console.log(rows);
	// render the page and pass in any flash data if it exists
	res.render('diary/list', { 
        title: '육아가 가장 쉬웠어요 - 육아일기',
		user : req.user, // get the user out of session and pass to template
		lists : rows,
        page: 'diary'
	}); 
});
});





/*router.post('/sql',function(req, res, next){
    
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
        res.redirect('/diary/list');
    });*/



/*


router.get('/content/:num', function(req, res) { //localhost:8080/diary/content/788

	// render the page and pass in any flash data if it exists
	res.render('diary/list', { 
        title: '육아가 가장 쉬웠어요 - ' 
	    
	});
});

router.get('/list', function(req, res) { //localhost:8080/diary/list

	// render the page and pass in any flash data if it exists
	res.render('diary/list', { 
        title: '육아가 가장 쉬웠어요 - ' 
	    
	});
});

router.get('/diary', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('diary/list', { 
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

*/

module.exports = router;