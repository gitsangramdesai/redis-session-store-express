var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//redis session
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'login' });
});


router.get('/bar', function (req, res, next) {
  req.session.city = 'Mumbai';
  console.log("Bar:city:" + req.session.city);
  res.redirect('/authhome')
});

router.get('/authhome', function (req, res, next) {
  console.log("AuthHome:city:" + req.session.city);
  res.render('authhome', { title: 'auth-home', username: req.session.username,city: req.session.city });
});

router.post('/login', function (req, res, next) {
  req.session.city = 'Mumbai';
  req.session.username = req.body.username;
  
  res.redirect('/authhome')
});

router.post('/logout', function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/home')
    }
  });

});

module.exports = router;
