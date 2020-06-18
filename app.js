var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router=require('./routes/index');
//var index = require('./routes/index');
//var users = require('./routes/users');
//引入ejs模块
var ejs=require('ejs');

var app = express();


mongoose.connect("mongodb://localhost:27017/nodedb", {
    useMongoClient: true,
});

// 测试数据库连接
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'mongodb connection error:'));

db.once('open', function() {
    console.log("mongodb connection success！")
});

User = require('./database/dbHandel');

User.findOne({ name: 'china' }, function (err, doc) {
        var resData = {};
        if (err) {
			console.log("载入失败");
		} else if (!doc) {
			console.log("没有中国");
			User.create({ name: 'china' }, function (err, doc) {
				if (err) console.log("载入失败");
			});
        } 
});

User.findOne({ name: 'world' }, function (err, doc) {
        var resData = {};
        if (err) {
			console.log("载入失败");
		} else if (!doc) {
			console.log("没有全球");
			User.create({ name: 'world' }, function (err, doc) {
				if (err) console.log("载入失败");
			});
        }
});

User.findOne({ name: '更新时间' }, function (err, doc) {
        var resData = {};
        if (err) {
			console.log("载入失败");
		} else if (!doc) {
			console.log("没有更新时间");
			User.create({ name: '更新时间',jsondata:'-1'}, function (err, doc) {
				if (err) console.log("载入失败");
			});
        }
});

User.findOne({ name: 'chinadaily' }, function (err, doc) {
        var resData = {};
        if (err) {
			console.log("载入失败");
		} else if (!doc) {
			console.log("没有历史");
			User.create({ name: 'chinadaily' }, function (err, doc) {
				if (err) console.log("载入失败");
			});
        }
});

mongoose.Promise = global.Promise;



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html',ejs.__express);  //增加
app.set('view engine', 'html');  //修改

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

router(app);
//app.use('/', index);
//app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
		err: err
	});
});

module.exports = app;
