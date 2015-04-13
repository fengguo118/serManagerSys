/*
 * 后台管理系统的主程序
 */

var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var cookieparser = require('cookie-parser');
var config = require('./lib/config.js').config;

/*mysql connect manager*/
var mysql = require('mysql');
console.log(config.mysqlCfg);
var mysqlCon = mysql.createConnection(config.mysqlCfg);

mysqlCon.connect();

var errorFun = function(error) {
	if (!error.fatal) {
		return;
	}

	if ((error.code !== 'PROTOCOL_CONNECTION_LOST') && (error.code !== 'ECONNREFUSED')) {
		throw error;
	}

	setTimeout(function() {
		mysqlCon.connect();
	}, 1000);
};

mysqlCon.on('error', function(error) {
	return errorFun(error);
});

var keepConnected = function() {
	setInterval(function() {
		mysqlCon.query("SELECT 1", function(error) {
			if (error) {
				mysqlCon = mysql.createConnection(mysqlCfg);
				mysqlCon.connect();
				mysqlCon.on('error', function(errof) {
					return errorFun(error);
				});
			}
		})
	}, 600 * 1000)
}

keepConnected();

/*
 * 初始化中间件使用
 */

app.use(bodyparser.urlencoded({
	extended: false
}));
app.use(bodyparser.json());
app.use(cookieparser());
app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/upload'));

/*
 * 如下是接口函数的主题
 */
/*web API*/
app.post('/login', function(req, res){
	console.log(req.body);
	var selStr = "SELECT * FROM user_table WHERE username=? AND password=?";
	mysqlCon.query(selStr, [req.body.username, req.body.password], function(err, result){
		if (err){
			console.log(err);
			return res.status(505).send("invalid username or password!");
		}
		console.log(result);
		if (result && result.length > 0){
			return res.send("login success");
		}	
	});	
});

app.post('/webProduct', function(req, res){
	console.log(req.body);
	var productType = req.body.productType;
	var selStr;
	if (parseInt(productType) == 0){
		selStr = "SELECT id as Id, productAttr as name, configAttr as configure, SkinClass as skin, price FROM peizhi_table";
		mysqlCon.query(selStr, function(err, result){
			if (err){
				console.log(err);
				return res.status(505).send("can not found data");
			}
			console.log(result);
			return res.send(result);
		});
	}
	else
	{
		selStr = "SELECT id as Id, productAttr as name, configAttr as configure, SkinClass as skin, price FROM peizhi_table WHERE productType=?";
		mysqlCon.query(selStr, [req.body.productType], function(err, result){
			if (err){
				console.log(err);
				return res.status(505).send("can not found data");
			}
			console.log(result);
			return res.send(result);
		});
	}
});

/*app API*/
app.post('/product', function(req, res){
	console.log(req.body);
	var selStr = "SELECT productAttr as productTitle, imageUrl FROM peizhi_table";
	mysqlCon.query(selStr, function(err, result){
		if (err){
			console.log(err);
			return res.status(505).send("can not found data!");
		}
		
		console.log(result);
		return res.send(result);
	});	
	
});


app.post('/configure', function(req, res){
	console.log(req.body.configAttr);
	var selStr = "SELECT configAttr FROM peizhi_table WHERE productAttr = ?";
	mysqlCon.query(selStr, [req.body.configAttr], function(err, result){
		if (err){
			console.log(err);
			return res.status(505).send("can not found data!");
		}
		console.log(result);
		return res.send(result);
	})	
});


app.post('/price', function(req, res){
	console.log(req.body);
	var selStr = "SELECT price FROM peizhi_table WHERE productAttr = ? AND configAttr=? AND SkinClass=?";
	mysqlCon.query(selStr, [req.body.productAttr, req.body.configAttr, req.body.SkinClass], function(err, result){
		if (err){
			console.log(err);
			return res.status(505).send("can not found data!");
		}	
		console.log(result);
		return res.send(result);
	});
});

/*
 * 启动， 监听端口
 */

app.listen(3000);

console.log("server is starting...!");
