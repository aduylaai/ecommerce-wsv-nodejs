'use strict'
// -> Mỗi lần export thì tạo ra 1 kết nối mới trong công nghệ khác. => Overload việc tạo kết nối quá nhiều
// Điều này ko sao trong node do có require rồi. Đây là kết nối cữ.
// Tuy nhiên đây là lối mòn tư duy sai. 
const mongoose= require('mongoose')

const connectString = 'mongodb://localhost:27017/eCommerceShop' // Ko được khai báo như thế này. Bỏ vào .env 


mongoose.connect(connectString).then(_ => console.log("Connect MongoDB success!"))
.catch(err => console.log('Error connect!'))

if (1===0) {
    mongoose.set('debug',true)
    mongoose.set('debug', {color: true})
}

module.exports = mongoose



