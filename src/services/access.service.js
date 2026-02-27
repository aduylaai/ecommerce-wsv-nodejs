'use strict'
const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: '1', //WRITE
    EDITOR: '2', //EDIT
    ADMIN: '0'
}

//Viet bang static => goi function luon
class AccessService{
    static signUp = async ({name, email, password})=>{
        try {
            //Step 1: Check email existance

            const hodelShop = await shopModel.findOne({email}).lean() //lean => tra ve obj js thuan tuy
            if(hodelShop){
                return {
                    code:'xxxx',
                    message:'Shop already registered'
                }
            }

            const passwordHash = await bcrypt.hash(password, 10) //salt -> do hash = 10 anh huong den CPU
            const newShop = await shopModel.create({name,email,password: passwordHash,roles: [RoleShop.SHOP]})
            
            //Tao cho shop newToken hoac refreshToken
            if(newShop){
                //C1: Redirect den trang log in -> login -> cap newToken

                //C2: Cap newToken -> auto login
                //Step 1: Created privateKey, publicKey 
                //privateKey cho nguoi dung local, sign token
                //publicKey thi de verify token.
                const {privateKey, publicKey } = crypto.generateKeyPairSync('rsa',{
                    modulusLength:4096
                }) //Thuat toan bat doi xung rsa
                

                console.log({privateKey,publicKey}); //save vao collection keyStore
            }
        } catch (error) {
            return{
                code :'xxx', // Viet trong document quy dinh cho team
                message: error.message,
                status: 'error'
            }
        }
    }

}

module.exports = AccessService