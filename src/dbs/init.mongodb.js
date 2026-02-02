'use strict'

const mongoose= require('mongoose')
const {countConnect} = require('../helpers/check.connect')
const {db : {host,name,port}} = require('../configs/config.mongodb')
// const connectString = `mongodb://:27017/eCommerceShop` // Ko được khai báo như thế này. Bỏ vào .env 
const connectString = `mongodb://${host}:${port}/${name}` // KHAI BAO CHUAN


// Singleton, tạo 1 instance để vào 1 database duy nhất.
class Database {
    constructor() {
        this.connect()
    }
    
    
    //connect:
    connect(type = 'mongodb'){
        if (1===1) { //dev in ra log, prod thì không.
            mongoose.set('debug',true)
            mongoose.set('debug', {color: true})
        }
        
        //PoolSize:: Giúp cải thiện hiệu suất và mở rộng của ứng dụng
        //Mongoose không vượt poolsize, tạo queue để xử lý xong, đợi free connection thì cho sử dựng.
        //Tăng poolsize thì dựa vào CPUs + memories phù hợp với tài nguyên.
        mongoose.connect(connectString, {
            maxPoolSize: 100
        }).then(_ => {
            console.log("Connect MongoDB success [Singleton]!", countConnect())
        })
        .catch(err => console.log('Error connect!'))
    }

    static getInstance(){
        if(!Database.instance)
        {
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb