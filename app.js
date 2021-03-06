var express = require('express');

//cookie-seesion
//var cookieSession = require('cookie-session')

//express-session-plain
var session = require('express-session');

const redisPassword = "sangram";
var redisStore = require('connect-redis')(session);
var redis = require("redis");
//var client = redis.createClient();

var client = redis.createClient({
  host: '127.0.0.1',
  no_ready_check: true,
  auth_pass: redisPassword,
});
var uuid = require('uuid/v4')

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.set('trust proxy', 1)

//express-session-plain
//app.use(session({ secret: 'ssshhhhh' }));

app.use(session({
  genid: function(req) {
    var uid = uuid() 
    console.log('UId :' + uid);
    return uid;
  },
  secret: 'my_secret',
  store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl :  260,disableTTL:true}),//disableTTL causes no expiry time override ttl
  saveUninitialized: false,
  resave: false
}));


//cookie-seesion
// app.use(cookieSession({
//   name: 'session',
//   keys: ['key1', 'key2'],
//   maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
