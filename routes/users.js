var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();
var async = require('async');

//构建url地址
var url = 'mongodb://127.0.0.1:27017';

/* GET users listing. */
router.get('/', function (req, res, next) {
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
    var db = client.db('nodejs-project');

    db.collection('user').find().toArray(function (err, data) {
      if (err) {
        console.log('查询用户数据失败，错误是：', err);
        //将错误通过error.ejs渲染到页面
        res.render('error', {
          message: '查询失败',
          error: err
        });
      } else {
        console.log(data);
        res.render('userManage', {
          list: data
        });
      }
      //无论是否存在错误，都要关闭数据库的连接
      client.close();

    })
  })
});
router.post('/login', function (req, res, next) {
  // console.log(req.body);
  //1.获取前端传过来的数据
  var username = req.body.username;
  var password = req.body.password;
  //2.有效性的校验
  if (!username) {
    res.render('error', {
      message: '用户名不能为空',
      error: new Error('用户名不能为空')
    })
    return;
  }
  if (!password) {
    res.render('error', {
      message: '密码不能为空',
      error: new Error('密码不能为空')
    })
    return;
  }
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
    if (err) {
      console.log('连接失败', err);
      res.render('error', {
        message: '连接失败',
        error: err
      })
      return;
    }

    var db = client.db('nodejs-project');
    //对数据库中的数据进行查找，如果能查找到数据，则登录成功
    // db.collection('user').find({
    //   username: username,
    //   password: password
    // }).count(function (err, num) {
    //   //查找结果的长度，有一条就查找成功
    //   if (err) {
    //     console.log('查询失败', err);
    //     res.render('error', {
    //       message: '查询失败',
    //       error: err
    //     })
    //   }else if(num>0){
    //       //登录成功,跳转到首页
    //       // res.render('index');
    //       //注意：当前url地址是  localhost ：3000/users/login;
    //       //如果直接使用 render（），页面地址是不会改变的
    //       res.redirect('/')
    //   }else{
    //     //登录失败
    //     res.render('error',{
    //       message:'登录失败',
    //       error:new Error('登录失败')   //没有传入err，所以要重新构建一个error构造函数的实例对象，来调用其方法
    //     })
    //   }
    //   client.close();
    // })
    db.collection('user').find({
      username: username,
      password: password
    }).toArray(function (err, data) {
      if (err) {
        console.log('查询失败', err);
        res.render('error', {
          message: '查询失败',
          error: err
        })
      } else if (data.length <= 0) {
        //没有找到
        res.render('error', {
          message: '登录失败',
          error: new Error('登录失败')
        })
      } else {
        //登录成功
        //cookie的操作---设置保持时间。来验证登录
        res.cookie('nickname', data[0].nickname, {
          maxAge: 60 * 60 * 1000
        })
        // res.redirect('http://localhost:3000');
        res.redirect('/');
      }
      client.close();
    })






  })



});

router.post('/register', function (req, res, next) {
  //获取form表单传递过来的数据
  var username = req.body.username;
  var password = req.body.password;
  var nickname = req.body.nickname;
  var phone = req.body.phone;
  var isAdmin = req.body.isAdmin === '是' ? " true " : " false";
  console.log(username,password,nickname,phone,isAdmin);

  // res.send(""); 

  //从这里开始做用户名查询，不存在就插入
 MongoClient.connect(url, { useNewUrlParser: true }, function(err,client){
    if (err) {
      res.render('error', {
        message: '连接数据库失败',
        error: err
      });
      return;
    }
    var db = client.db('nodejs-project');
    //在这里做async的操作
    async.series([
      function (cb) {
        //查找username，并计算它的数量
        db.collection('user').find({ username: username }).count(function (err, num) {
          if (err) {
            cb(err)
          } else if (num > 0) {
            console.log(num);
            //该用户已注册
            cb(new Error('已经注册'));
          } else {
            //数据库中没有该用户，可以注册
            cb(null);  //执行下一步
          }
        })
      }, function (cb) {
        db.collection('user').insertOne({
          username: username,
          password: password,
          nickname: nickname,
          phone: phone,
          isAdmin: isAdmin
        },function(err){
            if(err){
              cb(err);
            }else{
              cb(null);
            }
        })
      }
    ], function (err, result) {
      if(err){
        res.render('error',{
          message:'失败',
          error:err
        })
      }else{
        res.redirect('/login.html');
      }

      //关闭数据库连接
      client.close();
    })
  }) 



  /*  //插入数据库(没有做唯一用户验证的注册操作)
   MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
     if (err) {
       res.render('error', {
         message: '连接数据库失败',
         error: err
       });
       return;
     }
 
     var db = client.db('nodejs-project');
     db.collection('user').insertOne({
       username: username,
       password: password,
       nickname: nickname,
       phone: phone,
       isAdmin: isAdmin
     }, function (err) {
       if (err) {
         console.log('注册失败');
         res.render('error', {
           message: '注册失败',
           error: err
         })
       } else {
         //注册成功  跳转到登录页
         res.redirect('/login.html');
       }
       //关闭数据库连接
       client.close();
     })
   }) */

})

module.exports = router;
