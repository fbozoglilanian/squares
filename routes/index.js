var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
    res.render('index', { title: 'Squares!' });
});


router.get("/s", function(req, res, next) {
    res.render('singleplayer', {   title: 'Squares!',
                                    room: req.params[0] });
});

router.get(/^\/m\/(\w+)$/, function(req, res, next) {
    res.render('multiplayer', {   title: 'Squares!',
                                    room: req.params[0] });
});

module.exports = router;
