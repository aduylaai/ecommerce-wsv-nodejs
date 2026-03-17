'use strict'

const { publicDecrypt } = require("crypto")
const keytokenModel = require("../models/keytoken.model")
const shopModel = require("../models/shop.model")
const {Types} = require('mongoose')

class KeyTokenService{
    static createKeyToken = async ({userID,publicKey, refreshToken})=>{
            

        //New way
        console.log('[DEBUG] userID:: ', userID);
        const filter = {user: userID}, 
        update = {publicKey, refreshToken, refreshTokenUsed: []},
        options = {upsert :true, new: true}

        const tokens = await keytokenModel.findOneAndUpdate(filter,update, options)

        return tokens
    }

    static findByUserId = async (userID) => {
        return await keytokenModel.findOne({ user: new Types.ObjectId(userID)}).lean()
    }

    static removeById = async (id)=>{
        return await keytokenModel.deleteOne({_id:id})
    }
}

module.exports = KeyTokenService