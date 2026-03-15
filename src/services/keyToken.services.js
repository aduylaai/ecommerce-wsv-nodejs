'use strict'

const { publicDecrypt } = require("crypto")
const keytokenModel = require("../models/keytoken.model")
const shopModel = require("../models/shop.model")

class KeyTokenService{
    static createKeyToken = async ({userID,publicKey, refreshToken})=>{
            
        // Chi tao moi, ko update, ko toi uu
        // const publicKeyString = publicKey.toString()
            // const tokens = await keytokenModel.create({
            //     user: userID,
            //     publicKey: publicKeyString
            // })

            // return tokens ? tokens.publicKey : null

        //New way
        console.log('[DEBUG] userID:: ', userID);
        const filter = {user: userID}, 
        update = {publicKey, refreshToken, refreshTokenUsed: []},
        options = {upsert :true, new: true}

        const tokens = await keytokenModel.findOneAndUpdate(filter,update, options)

        return tokens
    }
}

module.exports = KeyTokenService