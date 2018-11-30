# express 操作 mongodb 步骤

1. 下载 mongodb 包
  1. npm install --save mongodb

2. 哪里要用，那里就引入 mongodb
  ```js
  var MongoClient = require('mongodb').MongoClient;
  var url = 'mongodb://127.0.0.1:27017'
  MongoClient.connect(url, function(client) {
    //... client
  })
  ```

# 表单验证，到底需要做几层。前端做or后端做

<!-- localhost:3000/login -->

# 登录校验

1. 登录成功存储cookie

2. 所有页面（排除登录、注册）都需要验证是否登录


# cookie 与 localStorage 、 sessionStorage 的区别

1. 大小区别：
  1. cookie 只能存储 4kb
  2. Storage 存储 5M
2. 过期时间的区别：
  1. cookie 是能够设置过期时间
  2. Storage 不能设置的
3. cookie 会随着http 请求一起发送， Storage 不会
4. localStorage 长期有效， sessionStorage 关闭当前会话，就会失效


## 注册的时候，需要先校验用户名是否已被注册

1. async 串行无关联



/users/register


## 分页实现

1. 确认每页显示多少条 pageSize
2. 确认当前是第几页   page
3. 总共的条数        totalSize
4. 一共多少页        totalPage  = Math.ceil(totalSize / pageSize);


1. 查询所有的条数
2. 查询当前页的数据


# git 与远程仓库关联

1. 先将于 github的关联给删除掉。
  1. git remote remove origin
2. 与 码云 关联
  1. git remote add origin <复制的地址>
3. 推送

# 上传图片功能 multer 包




# 搜索功能 nickname

张三丰
张三
李四

var name = req.query.name;  三
var filter = new RegExp(name);  /三/

db.xxx.find({ nickname: filter })


## 需求：

1. 用户分为 管理员与普通用户
2. 管理员才可以进入 用户管理，普通用户不能进用户管理
3. 用户管理里面，
  1. 列表，
  2. 分页
  3. 搜索
  4. 删除
4. 手机管理
  1. 列表
  2. 分页
  3. 删除
  4. 新增
  5. 修改
5. 品牌管理
  1. 列表
  2. 分页
  3. 删除
  4. 新增
