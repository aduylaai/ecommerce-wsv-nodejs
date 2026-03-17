'use strict'
//Payload
const JWT = require('jsonwebtoken')

const { asyncHandler } = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.services')

const HEADER = {
    API_KEY : 'x-api-key',
    CLIENT_ID : 'x-client-id',
    AUTHORIZATION : 'authorization'
}

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



const authentication = asyncHandler(async (req,res,next) => {
        /*
        This function to check authentication before any action like logout, ...
            1. Check userID missing?
            2. get accessToken.
            3. verifyToken.
            4. Check user in dbs?
            5. Check keystore with this user.
            6.return next
        */

        //Check userID
        const userID = req.headers[HEADER.CLIENT_ID]
        if (!userID) throw new AuthFailureError('Invalid Request')
        
        //2 getAccessToken
        const keyStore = await findByUserId(userID)
        if (!keyStore) throw new NotFoundError('Key store not found')
        
        //Verify Token
        const accessToken = req.headers[HEADER.AUTHORIZATION]
        if (!accessToken) throw new AuthFailureError('Invalid request')
        
        try {
            const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
            if (userID !== decodeUser.userID) throw new AuthFailureError('Invalid userID')
            req.keyStore = keyStore
            return next()
        } catch (error) {
            throw error
        }
})



module.exports= {
    createTokenPair,
    authentication
}