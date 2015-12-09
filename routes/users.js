var express = require('express');
var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
// router.use(function(req, res, next) {
    // invoked for any requests passed to this router
    // .. some logic here .. like any other middleware
//     next();
// });

router.get('/users/a', function(req, res, next) {
    console.log("-----------a------------");
    
    // res.render('index', { title: '육아가 가장 쉬웠어요' });
});

router.use(function(req,res,next){
    console.log("-----------use------------");
    next();
});

module.exports = router;