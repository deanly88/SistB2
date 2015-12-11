var express = require('express');
var mysql = require('./mysql');
var router = express.Router();

/* GET POST users listing. */
router.get('/', function(req, res, next) {
  console.log('req.baseUrl : '+req.baseUrl);
  console.log('req.path : '+req.path);
  console.log('req.params.test : '+req.params.test);
  console.log('req.route : '+req.route);
  res.render('test/input', { title: 'test' });
});

router.get('/chat', function(req, res, next) {
    res.render('test/chat');
});


router.post('/',function(req, res, next){
    
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
        res.redirect('/test/list');
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
});
router.get('/list', function(req, res, next) {
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

module.exports = router;