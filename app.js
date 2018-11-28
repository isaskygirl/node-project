var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var arr = require('./config/ignoreRouter.js');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//自己实现的中间件函数，用来判断用户是否登录（查询cookie信息是否存在）
//第一个参数不传，表示所有页面都要访问回调函数中的代码
app.use(function(req, res, next){
  //取cookie数据,cookie-parser中间件提供req.cookies.nickname得到数据
  // console.log(req.cookies.nickname);   //得到的是cookie中nickname对应的具体的值
  // req.get('Cookie');   //得到的是一个字符串
  if(arr.indexOf(req.url) >-1){
    next();      //如果当前url属于arr，那么就直接执行下一个函数；
    return;
  }


  var nickname = req.cookies.nickname;
  if(nickname){
    next(); //如果nickname存在，使函数查询完后继续往下走
  }else{
    // 如果nickname不存在，就跳转到 登录页面
    res.redirect('/login.html');   
  }
  
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
