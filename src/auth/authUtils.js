'use strict'
//Payload
const JWT = require('jsonwebtoken')
const createTokenPair = async (payload,publicKey, privateKey) => {
    //dang le chi can privateKey, tuy nhien publicKey de verify
    //Neu chi dung privateKey neu ngta bat duoc key thi se bi lo

    try {
        // Tao access Token = privateKey
        const accessToken = await JWT.sign(payload, privateKey , {
            algorithm: 'RS256',
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload, privateKey , {
            algorithm: 'RS256',
            expiresIn: '7 days'
        })

        console.log(`accessToken created::`, accessToken)

        //Verify using publicKey
        JWT.verify(accessToken, publicKey, (err,decode)=>{
            if(err){
                console.log(`Verify Error:: ${err.message}`);
            }
            else{
                console.log(`Decode verify::`, decode);
            }
        })

        return {accessToken, refreshToken}

    } catch (error) {
        console.log(`Error Founded:: ${error.message}`);
    }

}

module.exports= {
    createTokenPair
}