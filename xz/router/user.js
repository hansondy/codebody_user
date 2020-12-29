const express=require('express');
const pool = require('../pool.js');
const r=express.Router();
//1.用户注册
r.post('/reg',(req,res)=>{
    var obj=req.body;
    var i=400;
    for(var k in obj){
        i++;
        if(!obj[k]){
            res.send({code:i,msg:k+'不能为空'});
            return;
        }
    }
    pool.query('insert into xz_user set ?',[obj],(err,result)=>{
        if(err){
            res.send({code:500,msg:'服务器端错误'});
            return;
        }
        // if(result.affectedRows===0){
        //     res.send({code:201,msg:'注册失败'})
        // }
        res.send({code:200,msg:'注册成功'});
    });    
});
//2.用户登录
r.post('/login',(req,res)=>{
    var obj=req.body;
    if(!obj.uname){
        res.send({code:401,msg:'用户名不能为空'});
        return;
    }
    if(!obj.upwd){
        res.send({code:402,msg:'密码不能为空'});
        return;
    }
    pool.query('select * from xz_user where uname=? and upwd=?',[obj.uname,obj.upwd],(err,result)=>{
        if(err){
            res.send({code:500,msg:'服务器端错误'});
            return;
        }
        if(result.length===0){
            res.send({code:201,msg:'用户名或密码错误'})
        }else{
            res.send({code:200,msg:'登录成功'});
        }
    });
});
r.put('/:uid',(req,res)=>{
    var obj1=req.params;
    var obj2=req.body;
    var i=400;
    for(var k in obj2){
        i++;
        if(!obj2[k]){
            res.send({code:i,msg:k+'不能为空'});
            return;
        }
    }
    pool.query('update xz_user set ? where uid=?',[obj2,obj1.uid],(err,result)=>{
        if(err){
            res.send({code:500,msg:'服务器端错误'});
            return;
        }
        if(result.affectedRows===0){
            res.send({code:201,msg:'修改失败'});
        }else{
            res.send({code:200,msg:'修改成功'});
        }
    });
// res.send('修改成功');
});
//添加用户列表的路由
r.get('/',(req,res)=>{
    var obj=req.query;
    if(!obj.pno){
        obj.pno=1;
    }
    if(!obj.count){
        obj.count=2;
    }
    var x=parseInt(obj.count);
    var y=(obj.pno-1)*x;
    pool.query('select uid,uname from xz_user limit ?,?',[y,x],(err,result)=>{
        if(err){
            res.send({code:500,msg:'服务器端错误'});
            return;
        }
        //console.log(result);
        res.send({code:200,msg:'查询成功',data:result});
    });
});
//添加检测用户名是否存在的路由
r.get('/checkuname',(req,res)=>{
    var obj=req.query;
    pool.query('select * from xz_user where uname=?',[obj.uname],(err,result)=>{
        if(err){
            res.send({code:500,msg:'服务器端错误'});
            return;
        }
        if(result.length===0){
            res.send({code:200,msg:'该用户可以使用'});
        }else{
            res.send({code:201,msg:'该用户名已被注册'});
        }
        //console.log(result);
    });
});
//添加删除用户的路由
r.delete('/',(req,res)=>{
    var obj=req.query;
    if(!obj.uid){
        res.send({code:401,msg:'uid不能为空'});
        return;
    }
    pool.query('delete from xz_user where uid=?',[obj.uid],(err,result)=>{
        if(err){
            res.send({code:500,msg:'服务器端错误'});
            return;
        }
        if(result.affectedRows===0){
            res.send({code:201,msg:'删除失败'});
        }else{
            res.send({code:200,msg:'删除成功'});
        }

    });
});


module.exports=r;
