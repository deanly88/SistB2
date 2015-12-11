var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('home', { title: '육아가 가장 쉬웠어요' });
});

router.get('/regist', function(req, res, next) {
    res.render('member/regist', { 
        title: '육아가 가장 쉬웠어요 - 회원가입'
    });
});

router.get('/music', function(req, res, next) {
    res.render('premom/music', { 
        title: '육아가 가장 쉬웠어요 - 프리맘 - 태교 음악'
    });
});

router.get('/babyvideo', function(req, res, next) {
    res.render('premom/babyvideo', { 
        title: '육아가 가장 쉬웠어요 - 프리맘 - 태교 동영상'
    });
});
router.get('/beforeinfo', function(req, res, next) {
    res.render('premom/beforeinfo', { 
        title: '육아가 가장 쉬웠어요 - 프리맘 - 시기별 정보'
    });
});
router.get('/babycenter', function(req, res, next) {
    res.render('babymom/babycenter', { 
        title: '육아가 가장 쉬웠어요 - 베이비 맘 - 베이비 센터'
    });
});
router.get('/momcenter', function(req, res, next) {
    res.render('babymom/momcenter', { 
        title: '육아가 가장 쉬웠어요 - 베이비 맘 - 맘 센터'
    });
});
router.get('/afterinfo', function(req, res, next) {
    res.render('babymom/afterinfo', { 
        title: '육아가 가장 쉬웠어요 - 베이비 맘 - 시기별 정보'
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
    res.render('gallery/photo', { 
        title: '육아가 가장 쉬웠어요 - 갤러리 - 사진'
    });
});
router.get('/video', function(req, res, next) {
    res.render('gallery/video', { 
        title: '육아가 가장 쉬웠어요 - 갤러리 - 동영상'
    });
});
router.get('/viewer', function(req, res, next) {
    res.render('viewer', { 
        title: '육아가 가장 쉬웠어요 - 성장뷰어'
    });
});
router.get('/notice', function(req, res, next) {
    res.render('community/notice', { 
        title: '육아가 가장 쉬웠어요 - 커뮤니티 - 공지사항'
    });
});
router.get('/qna', function(req, res, next) {
    res.render('community/qna', { 
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
    res.render('community/board', { 
        title: '육아가 가장 쉬웠어요 - 커뮤니티 - 자유게시판'
    });
});
router.get('/option', function(req, res, next) {
    res.render('option', { 
        title: '육아가 가장 쉬웠어요 - 설정 '
    });
});


module.exports = router;