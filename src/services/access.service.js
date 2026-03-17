'use strict'
const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.services");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError,AuthFailureError } = require("../core/error.response");
const { findByEmailAsync } = require("./shop.services");

//Bo vao file const
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: '1', //WRITE
    EDITOR: '2', //EDIT
    ADMIN: '0'
}

//Viet bang static => goi function luon
class AccessService{
    
    /*
        LOGIN FLOW:
    1. Check email.
    2. Match password.
    3. Create AT and RT.
    4. Create tokens.
    5. Return login data
    */
    static login = async ({email, password, refreshToken = null})=>{

        //1.
        const foundShop = await findByEmailAsync(email)
        if (!foundShop){
            throw new BadRequestError('This shop is not Registered!') 
        }

        //2. 
        // console.log('[DEBUG] foundShop::',foundShop);
        
        // console.log('[DEBUG] passwordInput::',password);
        // console.log('[DEBUG] hashPassword::',foundShop.password);

        const isMatchPassword = await bcrypt.compare(password, foundShop.password)
        if(!isMatchPassword) throw new AuthFailureError('Authentication Error')
        

        //3.
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
                }) 
        //4.
        const publicKeyObject = crypto.createPublicKey(publicKey.toString())
        console.log(`PublicKey Obj:: `, publicKeyObject);

        const {_id: userID} = foundShop //destructing for clean code
        console.log(`[DEBUG] userID:: `,userID);
        const tokens = await createTokenPair({userID: userID,email}, publicKeyObject, privateKey)
        
        await KeyTokenService.createKeyToken({userID,publicKey, refreshToken: tokens.refreshToken})

        return {
            shop: getInfoData({fields: ['_id','name','email'],object: foundShop}),
            tokens
        }
}



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
                console.log('privateKey:: ', privateKey);

                //Step 2: Save publicKey into Server Database
                const newKeyToken = await KeyTokenService.createKeyToken({
                    userID: newShop._id,
                    publicKey,
                    refreshToken: null
                })

                // If not then return err
                const publicKeyString = newKeyToken.publicKey
                if(!publicKeyString){
                    throw new BadRequestError("Error:: Internal Server Error")
                }
                
                console.log(`[DEBUG] publicKeyString:: `, publicKeyString);

                const publicKeyObject = crypto.createPublicKey(publicKey)
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



        //Logout 

        static logout = async (keyStore) => {
            const delKey = await KeyTokenService.removeById(keyStore._id)
            // console.log({delKey});
            return delKey
        }


}

module.exports = AccessService