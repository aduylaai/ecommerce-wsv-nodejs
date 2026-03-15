'use strict'

const shopModel = require('../models/shop.model')

const findByEmailAsync = async ({email, select = {
    email:1, name:1, roles: 1, status:1,password:1
}}) => {
    return shopModel.findOne(email,select=select).lean()
}


module.exports = {
    findByEmailAsync
    }