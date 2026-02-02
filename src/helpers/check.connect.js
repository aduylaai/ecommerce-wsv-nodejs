'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000 //Bắt buộc phải nhúng bằng constant, không được đưa số vào trong code

//count Connect
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connection::${numConnection}`)
}

//check Overload
const checkOverload = () => {
    //Check monitor every 5s using
    setInterval(()=>{
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        // Gắn biến maxConnections để check
        const maxConnections = numCores * 5; //Giả sử mỗi core chịu được 5 connections
        
        console.log(`Active connection:: ${numConnection}`)
        console.log(`Memory usage:: ${memoryUsage/1024/1024} MB`) //Log Memery Usage

        //Overload
        if(numConnection > maxConnections){
            console.log(`Connection overload detected!`)
            //notify.send(....)
        }
    }, _SECONDS)
}

//Có nên đóng kết nối mongoose liên tục không -> Không. Vì có mongoose tự động đóng mở.


module.exports={
    countConnect,
    checkOverload
}
