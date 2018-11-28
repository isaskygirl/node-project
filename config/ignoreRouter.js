//需要忽略的url地址，不需要做url登录校验
//将所有的url提取到这里,再暴露即可
var arr = [
    '/login.html',
    '/register.html',
    '/users/login',
    '/users/register'
];
module.exports = arr;
