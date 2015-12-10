var express = require('express');
var mysql = require('./mysql');
var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
// router.use(function(req, res, next) {
    // invoked for any requests passed to this router
    // .. some logic here .. like any other middleware
//     next();
// });

router.post('/',function(req, res, next){
    
    console.log("-----------users.js post: /users------------");
    var user = {'userid':req.body.userid,
                'name':req.body.name,
                'address':req.body.address};
    var query = mysql.connection.query('insert into test set ?',user,function(err,result){
        if (err) {
            console.error(err);
            throw err;
        }
        console.log(query);
        res.send(200,'success');
    });
});
router.get('/', function(req, res, next) {
    var query = mysql.connection.query('select * from test',function(err,rows){
        if(err){
            console.error(err);
            throw err;
        }
        console.log(rows);
        res.json(rows);
    });
    console.log(query);
});

router.get('/login', function(req, res, next) {
    res.render('member/login', { 
        title: '육아가 가장 쉬웠어요 - 로그인'
    })
})

router.get('/a', function(req, res, next) {
    console.log("-----------a------------");
    
    // res.render('index', { title: '육아가 가장 쉬웠어요' });
    next();
});

router.use(function(req,res,next){
    console.log("-----------use------------");
    next();
});

module.exports = router;