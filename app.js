/*
 * 后台管理系统的主程序
 */

var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var cookieparser = require('cookie-parser');

/*
 * 初始化中间件使用
 */

app.use(bodyparser.urlencoded({
	extended: false
}));
app.use(bodyparser.json());
app.use(cookieparser());
app.use(express.static(__dirname + '/static'));

/*
 * 如下是接口函数的主题
 */






/*
 * 启动， 监听端口
 */

app.listen(3000);

console.log("server is starting...!");
