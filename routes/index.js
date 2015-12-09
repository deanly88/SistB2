var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('req.baseUrl : '+req.baseUrl);
  console.log('req.path : '+req.path);
  console.log('req.params.test : '+req.params.test);
  console.log('req.route : '+req.route);
  res.render('home', { title: '육아가 가장 쉬웠어요' });
});

router.get('/music', function(req, res, next) {
    res.render('premom/music', { 
        title: '육아가 가장 쉬웠어요 - 프리맘 - 태교 음악'
    });
});
router.get('/video', function(req, res, next) {
    res.render('video', { 
        title: '육아가 가장 쉬웠어요 - 프리맘 - 태교 동영상'
    });
});
router.get('/babycenter', function(req, res, next) {
    res.render('babycenter', { 
        title: '육아가 가장 쉬웠어요 - 베이비 맘 - 베이비 센터'
    });
});
router.get('/momcenter', function(req, res, next) {
    res.render('momcenter', { 
        title: '육아가 가장 쉬웠어요 - 베이비 맘 - 맘 센터'
    });
});
router.get('/diary', function(req, res, next) {
    res.render('diary', { 
        title: '육아가 가장 쉬웠어요 - 맘스 다이어리'
    });
});
router.get('/calendar', function(req, res, next) {
    res.render('calendar', { 
        title: '육아가 가장 쉬웠어요 - 캘린더'
    });
});
router.get('/photo', function(req, res, next) {
    res.render('photo', { 
        title: '육아가 가장 쉬웠어요 - 갤러리 - 사진'
    });
});
router.get('/video', function(req, res, next) {
    res.render('video', { 
        title: '육아가 가장 쉬웠어요 - 갤러리 - 동영상'
    });
});
router.get('/viewer', function(req, res, next) {
    res.render('viewer', { 
        title: '육아가 가장 쉬웠어요 - 성장뷰어'
    });
});
router.get('/notice', function(req, res, next) {
    res.render('notice', { 
        title: '육아가 가장 쉬웠어요 - 커뮤니티 - 공지사항'
    });
});
router.get('/qna', function(req, res, next) {
    res.render('qna', { 
        title: '육아가 가장 쉬웠어요 - 커뮤니티 - Q & A '
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
    res.render('board', { 
        title: '육아가 가장 쉬웠어요 - 커뮤니티 - 자유게시판'
    });
});
router.get('/option', function(req, res, next) {
    res.render('option', { 
        title: '육아가 가장 쉬웠어요 - 설정 '
    });
});


module.exports = router;
