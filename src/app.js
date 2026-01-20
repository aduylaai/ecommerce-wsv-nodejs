//Khai báo 1 middleware
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression')
const app = express();

//init middlewares

//morgan -> in log
app.use(morgan("dev")) //-> Trạng thái được tô màu status http (dung cho dev)
//5 che do morgan
// morgan("combined") //-> full theo tieu chuan apache (dung cho product)
// morgan("common") //-> ko co cai resources (ko biet toools)
// morgan("short") //->Thong bao ngan hon, bao gom thoi gian phan hoi + phuong thuc
// morgan("tiny") //-> Ngan hon nua, chi co phuong thuc + status + thoi gian

//helmet -> thêm các security cho headers.
// Ẩn các header đi, không cho biết công nghệ tránh lỗ hổng
app.use(helmet())

// conpression -> payload :: vận chuyển dữ liệu
// khi gửi quá nhiều thì tốn băng thông 
//-> giảm băng thông
app.use(compression())


//init database



//init routers
app.get("/", (req,res,next)=>{
    const strCompress = 'hello moi nguoi'

    return res.status(200).json({
        message:'Hello Api World!',
        metadata: strCompress.repeat(1000)
    })
})


//handling errors

module.exports = app; 

//Những package ko thể thiếu:
//morgan: in ra các log khi người dùng chạy 1 request
//
