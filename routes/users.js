var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();

//构建url地址
var url = 'mongodb://127.0.0.1:27017';

/* GET users listing. */
router.get('/', function(req, res, next) {
   MongoClient.connect(url,{useNewUrlParser:true},function(err,client){
      var db = client.db('nodejs-project');

      db.collection('user').find().toArray(function(err,data){
          if(err){
              console.log('查询用户数据失败，错误是：',err);
              //将错误通过error.ejs渲染到页面
              res.render('error',{
                message:'查询失败',
                error: err
              });
          }else{
            console.log(data);
            res.render('userManage',{
              list:data
            });
          }
          //无论是否存在错误，都要关闭数据库的连接
          client.close();

      })
   })
});
// router.post('/login', function(req, res, next) {
//   res.render('register');
// });

module.exports = router;
