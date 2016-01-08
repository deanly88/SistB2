var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('home', { 
      title: '육아가 가장 쉬웠어요',
	  user : req.user, // get the user out of session and pass to template
      page: 'home'
  });
});

/*router.get('/', function(req, res, next) {
    
  
    
  if(typeof user == 'object'&& user == req.user[0].id){
      
       mysql.connection.query('select * from photo where ? order by num desc limit 4',{'id':req.user[0].id}, function(err, rows){
    if(err){
        console.log(err);
    }
    
  res.render('home', { 
      title: '육아가 가장 쉬웠어요',
	  user : req.user, // get the user out of session and pass to template
	  photoTable : rows,
      page: 'home'
  });
});
      
    }else{
    
    res.render('home', { 
      title: '육아가 가장 쉬웠어요',
	  user : req.user, // get the user out of session and pass to template
      page: 'home'
  });

    }     
    
});
*/


router.get('/music', function(req, res, next) {
    res.render('premom/music', { 
        title: '육아가 가장 쉬웠어요 - 프리맘 - 태교 음악',
		user : req.user, // get the user out of session and pass to template
        page: 'premom'
    });
});

router.get('/babyvideo', function(req, res, next) {
    res.render('premom/babyvideo', { 
        title: '육아가 가장 쉬웠어요 - 프리맘 - 태교 동영상',
		user : req.user, // get the user out of session and pass to template
        page: 'premom'
    });
});

router.get('/beforeinfo', function(req, res, next) {
    res.render('premom/beforeinfo', { 
        title: '육아가 가장 쉬웠어요 - 프리맘 - 시기별 정보',
		user : req.user, // get the user out of session and pass to template
        page: 'premom'
    });
});

router.get('/babycenter', function(req, res, next) {
    res.render('babymom/babycenter', { 
        title: '육아가 가장 쉬웠어요 - 베이비 맘 - 베이비 센터',
		user : req.user, // get the user out of session and pass to template
        page: 'babymom'
    });
});

router.get('/momcenter', function(req, res, next) {
    res.render('babymom/momcenter', { 
        title: '육아가 가장 쉬웠어요 - 베이비 맘 - 맘 센터',
		user : req.user, // get the user out of session and pass to template
        page: 'babymom'
    });
});

router.get('/afterinfo', function(req, res, next) {
    res.render('babymom/afterinfo', { 
        title: '육아가 가장 쉬웠어요 - 베이비 맘 - 시기별 정보',
		user : req.user, // get the user out of session and pass to template
        page: 'babymom'
    });
});


router.get('/video', function(req, res, next) {
    res.render('gallery/video', { 
        title: '육아가 가장 쉬웠어요 - 갤러리 - 동영상',
		user : req.user, // get the user out of session and pass to template
        page: 'gallery'
    });
});

router.get('/notice', function(req, res, next) {
    res.render('community/notice', { 
        title: '육아가 가장 쉬웠어요 - 커뮤니티 - 공지사항',
		user : req.user, // get the user out of session and pass to template
        page: 'community'
    });
});

router.get('/qna', function(req, res, next) {
    res.render('community/qna', { 
        title: '육아가 가장 쉬웠어요 - 커뮤니티 - Q & A ',
		user : req.user, // get the user out of session and pass to template
        page: 'community'
    });
});

router.get('/board/:boardId-:contentId', function(req, res, next) {
    //TODO(dean): pageHandle - list, write, check(del), content
    //페이지 번
  console.log('req.baseUrl : '+req.baseUrl);
  console.log('req.path : '+req.path);
  console.log('req.params.boardId : '+req.params.boardId);
  console.log('req.params.contentId : '+req.params.contentId);
  console.log('req.route : '+req.route);
    res.render('community/board', { 
        title: '육아가 가장 쉬웠어요 - 커뮤니티 - 자유게시판',
		user : req.user, // get the user out of session and pass to template
        page: 'community'
    });
});

router.get('/option', function(req, res, next) {
    res.render('option', { 
        title: '육아가 가장 쉬웠어요 - 설정 ',
		user : req.user, // get the user out of session and pass to template
        page: 'option'
    });
});


module.exports = router;