'use strict'

const { publicDecrypt } = require("crypto")
const keytokenModel = require("../models/keytoken.model")

class KeyTokenService{
    static createKeyToken = async ({userID,publicKey})=>{
            const publicKeyString = publicKey.toString()
            const tokens = await keytokenModel.create({
                user: userID,
                publicKey: publicKeyString
            })

            return tokens ? tokens.publicKey : null
    }
}

module.exports = KeyTokenService