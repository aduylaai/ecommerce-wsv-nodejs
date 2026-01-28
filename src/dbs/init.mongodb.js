'use strict'

const mongoose= require('mongoose')
const {countConnect} = require('../helpers/check.connect')


const connectString = 'mongodb://localhost:27017/eCommerceShop' // Ko được khai báo như thế này. Bỏ vào .env 

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
        
        mongoose.connect(connectString).then(_ => {
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