var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    // res.send();
    res.render('index', { 
        title: '육아가 가장 쉬웠어요'
    });
});

module.exports = router;
