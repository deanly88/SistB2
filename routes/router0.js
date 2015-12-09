var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index', { title: '육아가 가장 쉬웠어요' });
});

router.get('/', function(req, res, next) {
    res.render('premom', { 
        title: '예비엄마'
    });
});

router.get('/users/a', function(req, res, next) {
    console.log("-----------a------------");
    next();    
});

router.use(function(req,res,next){
    console.log("-----------use------------");
    next();
});