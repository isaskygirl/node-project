var express = require('express');
var router = express.Router();
var multer = require('multer');
var async = require('async');
var upload = multer({ dest: 'D:/newpicture' });
//dest ：设置图片(文件)的临时目录
var fs = require('fs');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017';

router.get('/', function (req, res, next) {
    var page = parseInt(req.query.page) || 1;
    var pageSize = parseInt(req.query.pageSize) || 3;
    var totalSize = 0;


    //在这里将数据库中的数据渲染到页面
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err) {

            res.render('error', {
                message: '查询手机数据失败',
                error: err
            })
            return;
        }
        var db = client.db('nodejs-project');
        async.series([function (cb) {
            db.collection('phone').find().count(function (err, num) {
                if (err) {
                    cb(err);
                } else {
                    totalSize = num;
                    cb(null);
                }
            })
        }, function (cb) {
            db.collection('phone').find().limit(pageSize).skip((page - 1) * pageSize).toArray(function (err, data) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, data);   //没有错误继续向下执行，并携带data数据
                }
            })
        }], function (err, result) {
            if (err) {
                res.render('error', {
                    message: '查询数据错误',
                    error: err
                })
            } else {
                var totalPage = Math.ceil(totalSize / pageSize);
                // console.log(result[1])
                res.render('phoneManage', {
                    //将数据渲染到页面
                    list: result[1],
                    totalPage: totalPage,
                    curPage: page,
                    pageSize: pageSize
                })
            }
            client.close();
        })


        /*  var db = client.db('nodejs-project');
         db.collection('phone').find().toArray(function (err, data) {
             if (err) {
                 console.log('查询手机失败，错误：', err);
                 res.render('error', {
                     message: '查询手机数据失败',
                     error: err
                 })
             } else {
                 console.log(data)
                 res.render('phoneManage', {
                     list: data
                 })
 
             }
         }) */
    })

    // res.render('phoneManage'); 
})


//.single('图片的name') ---上传一张图片
//array()----上传多个
router.post('/newPhone', upload.single('file'), function (req, res, next) {
    //使用了multer，并且在当前接口上使用了该中间件，这些req对象上就会有一个file属性，就包含着图片上传的一些文件信息
    // console.log(req.file);
    //multipart/form-data 的设置会导致文件上传到后台的内容为空对象
    // console.log(req.body);  文件上传成功，res.body 会生效   
    var filename = 'phoneImg/' + new Date().getTime() + '_' + req.file.originalname;   //这里定义图片路径
    var newFileName = path.resolve(__dirname, '../public', filename);


    try {
        var data = fs.readFileSync(req.file.path);
        fs.writeFileSync(newFileName, data);

        // console.log(req.body);
        //上传成功，操作数据库将数据写入
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
            if (err) {
                res.render('error', {
                    message: '连接数据库失败',
                    error: err
                })
                return;
            }
            var db = client.db("nodejs-project");
            db.collection('phone').insertOne({
                phoneName: req.body.name,
                phoneBrand: req.body.brand,
                phonePrice: req.body.price,
                phonePrice2: req.body.price2,
                filename: filename
            }, function (err) {
                res.redirect('/phone');
                // res.send('手机数据插入成功');
            })
        })
        // res.send("上传成功");
    } catch (error) {
        res.render('error', {
            message: '新增手机失败',
            error: error
        })
    }
})

router.get('/delete', function (req, res, next) {
    var filename = req.query.filename;

    //连接数据库根据图片路径，查找到后删除
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err) {
            // console.log('查找数据库失败'),
            res.render('error', {
                message: '查找数据库失败',
                error: err
            })
            return;
        }
        var db = client.db('nodejs-project');
        db.collection('phone').deleteOne({
            filename: filename
        }, function (err, data) {
            if (err) {
                // console.log('删除失败'),
                res.render('error', {
                    message: '删除失败',
                    error: err
                })
            } else {
                //删除成功
                res.redirect('/phone');
            }
            client.close();
        })
    })

})


//修改信息
router.post('/update', upload.single('file'), function (req, res, next) {
    var imgSrc = req.body.imgSrc;
    var filename = "";
    if (req.file) {
        filename = 'phoneImg/' + new Date().getTime() + '_' + req.file.originalname;   //这里定义图片路径
    }
    filename = imgSrc;
    var newFileName = path.resolve(__dirname, '../public', filename);
    // console.log(filename)

    // console.log("===============================");

    // console.log(imgSrc);



    try {
        if (req.file) {
            var data = fs.readFileSync(req.file.path);
            fs.writeFileSync(newFileName, data);
            // console.log(data);
        }

        // console.log("===============================")
        // console.log(req.body);
        
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
            if (err) {
                res.render('error', {
                    message: '连接数据库失败',
                    error: err
                })
                return;
            }
            var db = client.db("nodejs-project");
            db.collection('phone').updateOne({ filename: imgSrc }, {
                $set: {
                    phoneName: req.body.name,
                    phoneBrand: req.body.brand,
                    phonePrice: req.body.price,
                    phonePrice2: req.body.price2,
                    filename: filename
                }
            }, function (err, result) {
                if (err) {
                    res.send('修改数据失败');
                } else {
                    res.redirect('/phone');
                }
            })
        })
    } catch (error) {
        res.render('error', {
            message: '修改数据失败',
            error: error
        })
    }
})
module.exports = router;
