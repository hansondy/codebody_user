const express=require('express');
const userRouter=require('./router/user.js');
const bodyParser=require('body-parser');
const app=express();
app.listen(8080);

app.use( bodyParser.urlencoded({
    extended:false
}) );
//挂载路由器,添加前缀'/v1/users'
app.use('/v1/users',userRouter);