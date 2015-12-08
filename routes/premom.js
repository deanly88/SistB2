var express = require('express');
var router = express.Router();

/* GET premom page. */
router.get('/', function(req, res, next) {
    res.render('premom', { 
        title: '예비엄마'
    });
});

module.exports = router;