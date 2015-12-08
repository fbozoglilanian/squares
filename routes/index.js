var express = require('express');
var router = express.Router();

/* GET home page. */
router.get(/^\/(\w+)$/, function(req, res, next) {
    res.render('index', { title: 'Squares!', room: req.params[0]});
});

module.exports = router;
