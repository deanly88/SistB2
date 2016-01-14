var express = require('express');
var mysql = require('../config/mysql');
var passport = require('passport');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: '../public/uploads/photo' });

/* GET POST users listing. */
//담당 writer : 지혜
//뷰 path : gallery/photo/
// 

router.get('/', function(req, res, next) { //localhost:8080/photo/
    mysql.connection.query('select * from photo where ? order by num desc',{'id':req.user[0].id}, function(err, rows){
    if(err){
        console.log(err);
    }
    //  console.log('=============================');
    //  console.log(req.user[0].id);
    //  console.log(rows);
    // render the page and pass in any flash data if it exists
    
	res.render('gallery/photo', { 
        title: '육아가 가장 쉬웠어요 - 사진',
		user : req.user, // get the user out of session and pass to template
		photoTable : rows,
        page: 'photo'
	    }); 
    });
});

router.get('/photoWrite', function(req, res, next) { // GET : localhost:8080/photo/photoWrite

	// render the page and pass in any flash data if it exists
	res.render('gallery/photoWrite', { 
        title: '육아가 가장 쉬웠어요 - 사진 추가하기',
        user : req.user, // get the user out of session and pass to template
        page: 'gallery'
	    
	});
});

router.post('/write', upload.single('photoAdd'), function(req, res, next){
//console.log(req);
 var photoAdd;
    if(req.file){
        photoAdd = req.file.filename;
    }else{
        photoAdd = req.user[0].photoAdd;
    }

    var user = {
                'title':req.body.title,
                'photoAdd':photoAdd,
    			'id':req.user[0].id,
    	        'date':req.body.date
				};
				
				
     mysql.connection.query('insert into photo set ?',user,function(err,result){
        if (err) {
            console.error(err);
            throw err;
        }
        //console.log(query);
        req.user[0].photoAdd = req.body.photoAdd;
        res.redirect('/photo');
    });
    
    
});
module.exports = router;