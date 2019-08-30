var express = require('express');
var router = express.Router();
// 为数据库链接的js文件，可查询数据库中的用户名和密码等信息
var usr=require('netRequest/dbConnect');

// 获取首页登录信息
router.get('/', function(req, res) {
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
  res.render('index', { title: 'HOME',test:res.locals.islogin});
});

// 登录页处理
router.route('/login')
    // get请求渲染页面    
    .get(function(req, res) {
        if(req.session.islogin){
            res.locals.islogin=req.session.islogin;
        }

        if(req.cookies.islogin){
            req.session.islogin=req.cookies.islogin;
        }
        res.render('login', { title: '用户登录' ,test:res.locals.islogin});
    })
    // post请求查询用户信息
    .post(function(req, res) {
        client=usr.connect();
        // 调用数据库方法
        usr.selectFun(client, req.body.username, function (result) {

            if(result[0]===undefined){
                res.send('没有该用户');
            }else{
                if(result[0].password==req.body.password){
                    req.session.islogin=req.body.username;
                    res.locals.islogin=req.session.islogin;
                    res.cookie('islogin',res.locals.islogin,{maxAge:60000});
                    res.redirect('/home');
                }else{
                    res.redirect('/login');
                }
            }
        });
    });
// 退出登录页处理
router.get('/logout', function(req, res) {
    res.clearCookie('islogin');
    req.session.destroy();
    res.redirect('/');
});

// home页处理
router.get('/home', function(req, res) {
    if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    res.render('home', { title: 'Home', user: res.locals.islogin });
});

// 注册页处理
router.route('/reg')
    // get请求渲染页面
    .get(function(req,res){
        res.render('reg',{title:'注册'});
    })
    // post请求注册用户
    .post(function(req,res) {
        client = usr.connect();
        // 调用数据库方法
        usr.insertFun(client,req.body.username ,req.body.password2, function (err) {
              if(err) throw err;
              res.send('注册成功');
        });
    });

module.exports = router;

