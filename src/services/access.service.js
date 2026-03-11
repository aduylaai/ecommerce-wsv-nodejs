'use strict'
const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.services");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");

//Bo vao file const
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: '1', //WRITE
    EDITOR: '2', //EDIT
    ADMIN: '0'
}

//Viet bang static => goi function luon
class AccessService{
    static signUp = async ({name, email, password})=>{
            //Step 1: Check email existance

            const holderShop = await shopModel.findOne({email}).lean() //lean => tra ve obj js thuan tuy
            if(holderShop){
                throw new BadRequestError('Error:: Shop already registered')
            }

            const passwordHash = await bcrypt.hash(password, 10) //salt -> do hash = 10 anh huong den CPU
            const newShop = await shopModel.create({name,email,password: passwordHash,roles: [RoleShop.SHOP]})
            
            //Tao cho shop newToken hoac refreshToken
            if(newShop){
                //C1: Redirect den trang log in -> login -> cap newToken

                //C2: Cap newToken -> auto login n
                //Step 1: Created privateKey, publicKey 
                //privateKey cho nguoi dung local, sign token
                //publicKey thi de verify token.


                const {privateKey, publicKey } = crypto.generateKeyPairSync('rsa',{
                    modulusLength:4096,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                }) //Thuat toan bat doi xung rsa
                
               

                // console.log({privateKey,publicKey}); //save vao collection keyStore

                //Step 2: Save publicKey into Server Database
                const publicKeyString = await KeyTokenService.createKeyToken({
                    userID: newShop._id,
                    publicKey
                })

                // If not then return err
                if(!publicKeyString){
                    throw new BadRequestError("Error:: Internal Server Error")
                }
                
                const publicKeyObject = crypto.createPublicKey(publicKeyString)
                console.log(`PublicKey Obj:: `, publicKeyObject);
               
                //Step 3: Create token pair
                //publicKey to verify, privateKey to sign.
                //AT for verify every action 
                //RT for refresh new AT when it's expired
                
                const tokens = await createTokenPair({userID: newShop._id,email}, publicKeyObject, privateKey)
                

                return {
                    code:201,
                    metadata:{
                        shop: getInfoData({fields: ['_id','name','email'], object: newShop}),// Su dung lodash -> function tot hon
                        tokens
                    }
                }

            }

            return {
                 code:200,
                    metadata:null
            }
        }
}

module.exports = AccessService